import MillionLint from '@million/lint';
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '**',
      port: '',
      pathname: '**'
    }]
  }
};
export default MillionLint.next({
  rsc: true,
  filter: {
    include: "**/components/*.{mtsx,mjsx,tsx,jsx}",
  },
})(nextConfig);