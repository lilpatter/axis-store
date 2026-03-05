# OAuth Setup (Google Sign-In Fix)

The `OAuthSignin` error usually means Google OAuth credentials or redirect URIs are misconfigured. Follow these steps:

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add **Authorized redirect URIs**:
   - Production: `https://axisstore.vercel.app/api/auth/callback/google`
   - Local: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

## 2. Vercel Environment Variables

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable             | Value                                   |
|----------------------|-----------------------------------------|
| `NEXTAUTH_URL`       | `https://axisstore.vercel.app`          |
| `NEXTAUTH_SECRET`    | (from `openssl rand -base64 32`)        |
| `GOOGLE_CLIENT_ID`   | Your Google Client ID                  |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret           |

**Important:** For production, `NEXTAUTH_URL` must be your live domain (`https://axisstore.vercel.app`), not `http://localhost:3000`. Otherwise Google will reject the OAuth redirect.

## 3. Redeploy

After changing environment variables, redeploy your app on Vercel.
