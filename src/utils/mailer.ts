import nodemailer from "nodemailer";
import { getHtmlForResetPassword } from "../views/getHtmlForResetPassword";
import generateAccessToken from "./generateAccessToken";
import generateToken from "./generateToken";
import { getHtmlForStock } from "../views/getHtmlForStock";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 995,
  secure: true,
  auth: {
    user: process.env.APP_GMAIL!,
    pass: process.env.APP_GMAIL_PASSWORD!,
  },
});

export const sendEmailForPasswordChange = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  try {
    const token = await generateToken({ email });
    const resetUrl = `${process.env.SERVER_HOSTED_URL}/users/reset-password/${token}`;
    const info =  transporter.sendMail({
      from: process.env.APP_GMAIL!, // sender address
      to: email, // list of receivers
      subject: "Change Password", // Subject line
      text: resetUrl, // plain text body
      html: getHtmlForResetPassword({ username, resetUrl }), // html body
    });
  } catch (error) {
    console.log("Something went wrong while sending mail for password reset");
  }
};

export const stockUpdatesMailer = async ({
  email,
  product,
  avaliablity,
}: {
  email: string;
  product: any;
  avaliablity: boolean;
}) => {
  try {
    const productURL = `${process.env.SERVER_HOSTED_URL}/---/${product.slug}`;
    if (avaliablity) {
      const info =  transporter.sendMail({
        from: process.env.APP_GMAIL!, // sender address
        to: email, // list of receivers
        subject: `${product.name} is in stock now!`, // Subject line
        text: "Hello world!", // plain text body
        html: getHtmlForStock({ email,product ,avaliablity }), // html body
      });
    } else {
      const info =   transporter.sendMail({
        from: process.env.APP_GMAIL!, // sender address
        to: email, // list of receivers
        subject: `${product.name} is now out of stock!`, // Subject line
        text: "Hello world!", // plain text body
        html: getHtmlForStock({ email,product,avaliablity }), // html body
      });
    }
  } catch (error) {
    console.log("Something went wrong while sending mail for Stock updates");
  }
};
