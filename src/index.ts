require("dotenv").config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApolloServer, BaseContext } from '@apollo/server'

import { expressMiddleware } from "@apollo/server/express4"
import connectDB from './db'
// import typeDefs from './utils/getGqlTypes'
import resolvers from './utils/getGqlResolvers'
import { verifyJWT } from './middleware/auth.middleware'
import gql from 'graphql-tag'
import { buildSubgraphSchema } from '@apollo/subgraph'

import { DocumentNode } from 'graphql'
import { GraphQLSchemaModule } from '@apollo/subgraph/dist/schema-helper'
import {readFileSync} from 'fs'
import typeDefinations from './utils/getGqlTypes'
const PORT = Number(process.env.PORT) || 8080
import awsIot from 'aws-iot-device-sdk'
import wrtc from 'wrtc'

import { v4 as uuid } from 'uuid'
import axios from 'axios'
const { RTCPeerConnection, RTCSessionDescription } = wrtc
const CHANNEL_LABELS = [
  'placeholder',
  'api:1',
  'api:2',
  'api:3',
  'api:4',
  'ws:/api/ws/system',
  'ws:/proxy/network/wss/s/default/events?clients=v2&next_ai_notifications=true',
  'ws:/proxy/network/wss/s/super/events?clients=v2',
]

const COOKIE =
  '_ga=GA1.1.1656127576.1754440928; _delighted_web={%229FoOFWGY0SEH2wkz%22:{%22_delighted_fst%22:{%22t%22:%221754440931084%22}}}; ui|design-center|sid=s%3A5u3gVvC8DjM4hiwS89ugFdbY156Jk3Ox.EzmZrmppj9hStxCTEn5obsClK8W3qXwjyzMWnSfoPoI; _ga_RMB3GLH2RD=GS2.1.s1754440928$o1$g1$t1754440985$j3$l0$h0; _ga_ET365PNYN5=GS2.1.s1754440938$o1$g1$t1754441140$j60$l0$h0; UBIC_AUTH="fjIwMjIwNjA3fGhBQ3NUSlVzN1JtWWYvYnpwQzVJNGg3WDdGQWVyc0craHkwVUtwMUlHSm1CU29UZnd0ME5LSldXeVlzcEs5RGJDcmRnTlpRa1U0aU9sUDBUb2xBekNSVy9FZ2VkZmwyZDhhc3NWYlZwc3ZtUzRSbXZyZ2hCYU5vSGxLeU1FVC9pN2VvSkp5eVU4U0tKVURaRW04M2tXbXpGL2JCRk84NE9XN3ZVZjhJbEJsTm92UUUyS25iVTJrUXpFNkNkNTlRRXF5QXMzK3hpUFlYTnp3MjFwN3FUSjEweU9XS2VRMldUREVKQW1STzFld0F1TjJwd3RXaEhpWmZMRGpFclhjd3U5RVZXc09mUGt6SVhnWHNhbHRjZ1hiMkdjR0I2M25HUVJEbFdJOFZiSzV1NW1GZDBra2V4eStrenIzWTQvZE03OEN6cEJOaUI3eWdIU0RJWStwYU5YdGFhNC9hNGZlQUNjTlkySVpvNzlJTi9SQT09fGNsaVdXQ3BZWEJud0JINVRIcUNBQlNqYWlDND18WjNZZ0ZWN0VRV2lzNng1MGoxWlVwdz09fFNaY2kzLzZBanprSXc2RDErc3Vzb1JIMVlKQT0="; _ga_6E4J2SDGKL=GS2.1.s1754536231$o8$g0$t1754536242$j49$l0$h0';
const CONTROLLER_ID =
  "942A6F12A1D60000000007EB63F1000000000855C8FB0000000065AFE20F:694216289";

let seq = 0
const nextSeq = () => ++seq
const mySeqSet = new Set()
async function init() {

    try {


        const app = express()
        const isProduction = process.env.NODE_ENV === 'production';

       
        const typeDefs = gql`
        ${typeDefinations}`;

        const gqlServer = new ApolloServer<BaseContext>({
            typeDefs,
            resolvers,
            introspection:true,

        })
        const corsOptions = {
            origin: [
                'https://swaggy-api-v1.vercel.app',
                'https://swaggy-e-comm.vercel.app',
                'https://dashboard-swaggy.vercel.app',
                'http://localhost:3000',// Add localhost with the appropriate port
            ],
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
          };
          

        // Middlewares
        app.use(express.json())
        app.use(cors(corsOptions));
        app.use(cookieParser());

        // index route
        app.get('/', (req, res) => {
            res.json({ message: "Hello World!!!" })
        })
        app.get('/turn', (req, res) => {
            try {
    console.log('[1] GET cloudAccessConfig.json')
    const { data: cfg } = await axios.get(
      'https://config.svc.ui.com/cloudAccessConfig.json',
      { headers: { Cookie: COOKIE } }
    )
    const cloud = cfg.unifiCloudAccess

    console.log('[2] POST create-credentials')
    const { data: creds } = await axios.post(
      `${cloud.apiGatewayUI.url}/create-credentials`,
      { withTurn: true },
      { headers: { Cookie: COOKIE, 'Content-Type': 'application/json' } }
    )

    console.log('[3] MQTT CONNECT →', cloud.iot.host)
    const mqtt = awsIot.device({
      protocol: 'wss',
      host: cloud.iot.host,
      clientId: creds.identityId,
      region: creds.region,
      accessKeyId: creds.accessKeyId,
      secretKey: creds.secretKey,
      sessionToken: creds.sessionToken,
      keepalive: 60,
      reconnectPeriod: 1_000,
      protocolVersion: 5,
    })

    let pc, callId, offerTopic, answerTopic1, answerTopic2
    let remoteSdpSet = false
    let pendingRemoteIce = []

    mqtt.on('connect', async () => {
      console.log('✓ MQTT connected')

      // subscribe to both client‐ and device‐scoped topics
      await Promise.all([
        new Promise(r => mqtt.subscribe(`client/${creds.identityId}/#`, r)),
        new Promise(r =>
          mqtt.subscribe(
            `device/${CONTROLLER_ID}/client/${creds.identityId}/#`,
            r
          )
        ),
      ])

      callId = `${uuid()}-0`
      offerTopic = `client/${creds.identityId}/device/${CONTROLLER_ID}/connect/${callId}`
      answerTopic1 = `device/${CONTROLLER_ID}/client/${creds.identityId}/connect/${callId}`
      answerTopic2 = `client/${creds.identityId}/${CONTROLLER_ID}/connect/${callId}`

      console.log('offerTopic  =', offerTopic)
      console.log('answerTopic =', answerTopic1)

      // kick off WebRTC signalling (fire‐and‐forget)
      startWebRTC()
    })

    mqtt.on('message', (topic, raw) => {
      let msg
      try {
        msg = JSON.parse(raw.toString())
      } catch {
        msg = raw.toString()
      }
      console.log('← BROKER→CLIENT', topic, msg)
      handleSignal(topic, msg)
    })

    mqtt.on('error', e => console.error('MQTT Error', e))

    // immediately return the callId & topics
    res.json({ callId, offerTopic, answerTopic1, message: 'WebRTC startup in progress' })

    // ─── internal helpers ─────────────────────────────────────────────────

    async function startWebRTC() {
      pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: creds.turnCredentials.uris,
            username: creds.turnCredentials.username,
            credential: creds.turnCredentials.password,
          },
        ],
        iceTransportPolicy: 'all',
        bundlePolicy: 'balanced',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 0,
      })

      // Listen for controller‐opened data channels
      pc.ondatachannel = ev => {
        const ch = ev.channel
        console.log('ℹ DataChannel opened:', ch.label)
        if (ch.label === 'ws:/api/ws/system') {
          ch.onopen = () => {
            console.log("✅ 'system' channel open – subscribing stats")
            ch.send(JSON.stringify({ command: 'subscribeStats', interval: 2000 }))
          }
          ch.onmessage = evt => {
            try {
              console.log('📈 stats', JSON.parse(evt.data))
            } catch {
              console.log('stats (raw)', evt.data)
            }
          }
          ch.onerror = err => console.error('DataChannel error', err)
        }
      }

      pc.oniceconnectionstatechange = () =>
        console.log('ICE state:', pc.iceConnectionState)
      pc.onconnectionstatechange = () =>
        console.log('Peer state:', pc.connectionState)

      let sdpCompleteSent = false
      pc.onicecandidate = ev => {
        if (ev.candidate) {
          const ice = {
            event: 'icecandidate',
            seq: nextSeq(),
            candidate: ev.candidate.candidate,
            mid: '0',
            mline_index: 0,
          }
          mySeqSet.add(ice.seq)
          mqtt.publish(offerTopic, JSON.stringify(ice))
          console.log('→ ICEcandidate seq=', ice.seq)
        } else if (!sdpCompleteSent) {
          sdpCompleteSent = true
          const done = { event: 'sdpcomplete', seq: nextSeq() }
          mySeqSet.add(done.seq)
          mqtt.publish(offerTopic, JSON.stringify(done))
          console.log('→ SDPCOMPLETE seq=', done.seq)
        }
      }

      // create & send offer
      const offerDesc = await pc.createOffer({ iceRestart: true })
      await pc.setLocalDescription(offerDesc)

      const offerFrame = {
        event: 'offer',
        seq: nextSeq(),
        offer: offerDesc.sdp,
        iceServers: [
          {
            urls: creds.turnCredentials.uris,
            username: creds.turnCredentials.username,
            credential: creds.turnCredentials.password,
          },
        ],
        timestamp: Date.now(),
      }
      mySeqSet.add(offerFrame.seq)
      mqtt.publish(offerTopic, JSON.stringify(offerFrame))
      console.log('→ OFFER sent seq=', offerFrame.seq)
    }

    async function handleSignal(topic, msg) {
      if (![offerTopic, answerTopic1, answerTopic2].includes(topic) || !msg?.event)
        return

      // ignore our own echoed messages
      if (topic === offerTopic && mySeqSet.has(msg.seq)) return

      // handle answer / sdpcomplete
      if (
        (msg.event === 'answer' || msg.event === 'sdpcomplete') &&
        !remoteSdpSet
      ) {
        console.log('← ANSWER / SDPCOMPLETE')
        await pc.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: msg.answer })
        )
        // flush any queued ICE
        for (const cand of pendingRemoteIce) {
          try {
            await pc.addIceCandidate(cand)
          } catch {}
        }
        pendingRemoteIce = []
        remoteSdpSet = true
        return
      }

      // handle remote ICE candidates
      if (msg.event === 'icecandidate') {
        const candStr = (typeof msg.candidate === 'string'
          ? msg.candidate
          : msg.candidate?.candidate || ''
        )
          .trim()
          .replace(/^a=/, '')
        if (!candStr) return
        const candObj = { candidate: candStr, sdpMid: '0', sdpMLineIndex: 0 }
        if (!remoteSdpSet) {
          pendingRemoteIce.push(candObj)
        } else {
          try {
            await pc.addIceCandidate(candObj)
            console.log('← ICE OK')
          } catch (e) {
            console.error('ICE‐add error', e)
          }
        }
      }
    }
  } catch (err) {
    console.error('Fatal:', err)
    // if headers are not sent, return 500
    if (!res.headersSent) res.status(500).json({ error: err.message })
  }
            res.json({ message: "Hello World!!!" })
        })
        // Restful Routes
        app.get('/health-check', (req, res) => {
            res.json({ message: "server is up and running" })
        })

        const handleAuth = (req: any, res: any, next: any) => {
            // console.log(req?.headers)
            // add route name in if block to protect them // private routes
            if (req?.body?.operationName == 'GetUser') { // update
                verifyJWT(req, res, next);
            } else {
                // all public 
                next();
            }
        }
        // DB connection
        await connectDB().then(async () => {

            // GQL Server
            await gqlServer.start()
            app.use("/graphql", handleAuth, expressMiddleware(gqlServer, {
                context: async ({ req, res }:{req:any,res:any}) => {
                    return({ req, res })
                },
              }))
            // HTTP Server
            app.listen(PORT, () => {
                console.log('Server is listning on PORT: ', PORT)
            })
        })
    } catch (error) {
        console.log(error)
    }

}
init();
