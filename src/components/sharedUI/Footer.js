import { Box, Grid, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return (
        <Box className="bg-[#f5f5f5] dark:bg-dark" component="footer" sx={{ py: 6, px: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          
          {/* Company Name and Social Media */}
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: 'left' }}>
            <Typography className="text-xl 2xl:text-2xl font-bold font-lora text-black dark:text-white">WedPlan BD</Typography>
            <Typography className="font-bold mt-8 text-black dark:text-white">Social Media</Typography>
            <Box className="-ml-3">
              <IconButton className="dark:text-white" color="primary" href="https://facebook.com" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton className="dark:text-white" color="primary" href="https://youtube.com" target="_blank">
                <YouTubeIcon />
              </IconButton>
              <IconButton className="dark:text-white" color="primary" href="https://twitter.com" target="_blank">
                <TwitterIcon />
              </IconButton>
              <IconButton className="dark:text-white" color="primary" href="https://instagram.com" target="_blank">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Venues Section */}
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: 'left' }}>
            <Typography className="text-lg font-bold font-lora text-black dark:text-white">Centers</Typography>
            <Box mt={2}>
              <Link href="/venues/venue1" className="font-lora font-semibold text-black dark:text-white" underline="hover">Abu Dhab</Link><br />
              <Link href="/venues/venue2" className="font-lora font-semibold text-black dark:text-white" underline="hover">Al Ain</Link><br />
              <Link href="/venues/venue3" className="font-lora font-semibold text-black dark:text-white" underline="hover">Ajman</Link><br />
              <Link href="/venues/venue4" className="font-lora font-semibold text-black dark:text-white" underline="hover">Dubai</Link><br />
              <Link href="/venues/venue5" className="font-lora font-semibold text-black dark:text-white" underline="hover">Fujairah</Link><br />
              <Link href="/venues/venue6" className="font-lora font-semibold text-black dark:text-white" underline="hover">Ras Al Khaimah</Link>
            </Box>
          </Grid>
  
          {/* Suppliers Section */}
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: 'left' }}>
            <Typography className="text-lg font-bold font-lora text-black dark:text-white">Suppliers</Typography>
            <Box mt={2}>
              <Link href="/suppliers/photographers" className="font-lora font-semibold text-black dark:text-white" underline="hover">Photographers</Link><br />
              <Link href="/suppliers/decorators" className="font-lora font-semibold text-black dark:text-white" underline="hover">Decorators</Link><br />
              <Link href="/suppliers/venue-planners" className="font-lora font-semibold text-black dark:text-white" underline="hover">Venue Planners</Link><br />
              <Link href="/suppliers/choreographers" className="font-lora font-semibold text-black dark:text-white" underline="hover">Choreographers</Link><br />
              <Link href="/suppliers/designers" className="font-lora font-semibold text-black dark:text-white" underline="hover">Designers</Link><br />
              <Link href="/suppliers/makeup-artists" className="font-lora font-semibold text-black dark:text-white" underline="hover">Makeup Artists</Link>
            </Box>
          </Grid>
  
          {/* Quick Links Section */}
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: 'left' }}>
            <Typography className="text-lg font-bold font-lora text-black dark:text-white">Quick Links</Typography>
            <Box mt={2}>
              <Link href="/about" className="font-lora font-semibold text-black dark:text-white" underline="hover">About Us</Link><br />
              <Link href="/careers" className="font-lora font-semibold text-black dark:text-white" underline="hover">Careers</Link><br />
              <Link href="/contact" className="font-lora font-semibold text-black dark:text-white" underline="hover">Contact Us</Link><br />
              <Link href="/privacy-policy" className="font-lora font-semibold text-black dark:text-white" underline="hover">Privacy Policy</Link><br />
              <Link href="/terms-conditions" className="font-lora font-semibold text-black dark:text-white" underline="hover">Terms & Conditions</Link>
            </Box>
          </Grid>
  
          {/* Description Section */}
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: 'left' }}>
            <Typography className="text-lg font-bold font-lora text-black dark:text-white">Welcome</Typography>
            <Typography className="font-lora font-semibold text-justify text-black dark:text-white" variant="body2" mt={2}>
              WedPlan BD is your one-stop solution for planning the perfect wedding in Bangladesh. From venues to suppliers, we bring everything you need under one roof.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }