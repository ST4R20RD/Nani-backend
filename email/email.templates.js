module.exports = {
  // Template to confirm email
  confirm: (id, url) => ({
    subject: "Welcome to Nani, please confirm your email",
    html: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; box-shadow: 0px 2px 7px 8px rgba(169,169,169,0.57);"><img src="https://res.cloudinary.com/dwtpq6hki/image/upload/v1650797264/nani-project/Logo_kj6ajy.png" alt="Nani Logo" />
    <h1>Welcome to Nani!</h1>
    <p style="margin: 16px 30px; text-align: center;">We are excited to have you on board. Please confirm your email address by clicking the link below.</p>
    <a style="font: bold 16px Arial; text-decoration: none; background-color: #cc34eb; color: white; padding: 12px 16px; border: 1px solid #CCCCCC;" href="http://${url}/confirm/${id}"> Verify email address </a><footer><hr />
    <p><a style="text-decoration: none; color: black;" href="https://www.ironhack.com/en">IronHack</a> &copy; <a style="text-decoration: none; color: black;" href="https://github.com/ST4R20RD">Gon&ccedil;alo</a> &amp; <a style="text-decoration: none; color: black;" href="https://github.com/RaAlMer">Ra&uacute;l Alonso</a></p>
    </footer></div>
    `,
    text: `Copy and paste this link: ${url}/confirm/${id}`,
  }),
};
