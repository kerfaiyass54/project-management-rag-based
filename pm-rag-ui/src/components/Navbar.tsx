import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, useTheme, useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ links }) => {
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const getIcon = (path) => {
    switch (path) {
      case '/':
        return <HomeIcon />;
      case '/about':
        return <InfoIcon />;
      case '/contact':
        return <ContactMailIcon />;
      case '/dev':
        return <DeveloperModeIcon />;
      default:
        return null;
    }
  };

  const renderNavLinks = (isMobileMenu = false) => {
    const linkComponents = links.map((link) => {
      const isActive = location.pathname === link.href;
      if (isMobileMenu) {
        return (
          <MenuItem
            key={link.href}
            component={Link}
            to={link.href}
            selected={isActive}
            onClick={() => setMobileMenuAnchorEl(null)}
          >
            {link.label}
          </MenuItem>
        );
      }
      return (
        <motion.div
          key={link.href}
          variants={buttonVariants}
          whileHover="hover"
        >
          <Button
            component={Link}
            to={link.href}
            sx={{
              color: isActive ? 'blue' : 'black',
            }}
            startIcon={getIcon(link.href)}
          >
            {link.label}
          </Button>
        </motion.div>
      );
    });

    if (isMobile) {
      return (
        <>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => setMobileMenuAnchorEl(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={() => setMobileMenuAnchorEl(null)}
          >
            {renderNavLinks(true)}
          </Menu>
        </>
      );
    }
    return linkComponents;
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 20,
        left: '5%',
        right: '5%',
        width: '90%',
        borderRadius: '50px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        margin: '0 auto',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            PM-RAG
          </Link>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {renderNavLinks()}
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} />
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => setMobileMenuAnchorEl(e.currentTarget)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <motion.div variants={buttonVariants} whileHover="hover">
          <IconButton sx={{ color: 'black' }} onClick={(e) => setLangAnchorEl(e.currentTarget)}>
            <LanguageIcon />
          </IconButton>
        </motion.div>
        <Menu
          anchorEl={langAnchorEl}
          open={Boolean(langAnchorEl)}
          onClose={() => setLangAnchorEl(null)}
        >
          <MenuItem>English</MenuItem>
          <MenuItem>French</MenuItem>
        </Menu>
        <motion.div variants={buttonVariants} whileHover="hover">
          <IconButton sx={{ color: 'black' }} onClick={(e) => setUserAnchorEl(e.currentTarget)}>
            <AccountCircleIcon />
          </IconButton>
        </motion.div>
        <Menu
          anchorEl={userAnchorEl}
          open={Boolean(userAnchorEl)}
          onClose={() => setUserAnchorEl(null)}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;