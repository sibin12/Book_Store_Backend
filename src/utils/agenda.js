import Agenda from 'agenda';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD
    }
});

const agenda = new Agenda({
    db: { address: process.env.MONGO_URL, collection: 'agendaJobs' }
});

agenda.define('send email', async (job) => {
    const { to, subject, text } = job.attrs.data;

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
});

(async function() {
    await agenda.start();
})();

export default agenda;
