const { OAuth2Client } = require('google-auth-library')

const getDecodedOAuthJwtGoogle = async (req, res, next) => {
  const CLIENT_ID_GOOGLE = process.env.OAUTH_CLIENT_ID
  const {token} = req.body
  console.log({token});
  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE)
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    })
    console.log({ticket : ticket?.payload});
    const payload = {
        name : ticket?.payload?.name,
        photo : ticket?.payload?.picture,
        email : ticket?.payload?.email
    }
    req.payload = payload
    next()
  } catch (error) {
    res.status(400).json({error})
  }
}

module.exports = {getDecodedOAuthJwtGoogle}