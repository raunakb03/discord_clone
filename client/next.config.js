/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io"
    ]
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
}

module.exports = nextConfig