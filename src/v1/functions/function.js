/* eslint-disable no-console */

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_SDK_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SDK_SECRET_ACCESS_KEY,
});

let transporter;

nodemailer.createTestAccount((err, account) => {
  if (process.env.NODE_ENV === "PROD") {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: Number(process.env.SMTP_PORT) || 2465,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }
});

exports.GenerateOTP = () => Math.floor(100000 + Math.random() * 900000);

exports.GenerateToken = (user) => {
  const token = jwt.sign(
    {
      // _id: user._id,
      // userName: user.userName,
      userCode: user.userCode,
      // password: user.password,
      // firstName: user.firstName,
      // lastName: user.lastName,
      // email: user.email,
    },
    process.env.SECRET,
    {
      expiresIn: "30days",
    }
  );
  return token;
};

exports.sendMail = async (emailTo, subject, text, html, file = []) => {
  try {
    const defaultMailOption = {
      from: process.env.SMTP_FROM || "noreply@techweirdo.in",
      to: emailTo,
      subject,
      text: text || "",
      html: html || "",
    };
    let mailOption = {};
    if (file.length) {
      mailOption = {
        ...defaultMailOption,
        attachments: [
          ...file, // { path: '', filename: '' }[]
        ],
      };
    } else {
      mailOption = {
        ...defaultMailOption,
      };
    }
    await transporter.sendMail(mailOption).then((info) => {
      console.log(`\n\nPreview URL:\n>> ${nodemailer.getTestMessageUrl(info)}\n\n`);
    });
  } catch (err) {
    console.log(err);
  }
};

function formatFileName(fileName) {
  const removeSpecialRx = /[^a-zA-Z0-9 ]/g;
  const forFileName = /\.[^.]*$/;
  const forExt = /(?:\.([^.]+))?$/;

  const [extension] = forExt.exec(fileName);
  const fileNameWithSpecial = fileName.replace(forFileName, "");
  const fileNameRemovedSpecial = fileNameWithSpecial.replace(removeSpecialRx, "");
  const finalStr = fileNameRemovedSpecial + extension;
  return finalStr.replace(/\s/g, "_");
}

exports.upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_SDK_S3_BUCKET_NAME || "",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const name = `${Date.now().toString()}_${formatFileName(file.originalname)}`;
      cb(null, `${name}`);
    },
  }),
});
