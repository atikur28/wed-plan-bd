"use client";

import { AccountCircle } from '@mui/icons-material';
import ContactsIcon from '@mui/icons-material/Contacts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EastIcon from '@mui/icons-material/East';
import FaceIcon from '@mui/icons-material/Face';
import HouseIcon from '@mui/icons-material/House';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LoginIcon from '@mui/icons-material/Login';
import MediationIcon from '@mui/icons-material/Mediation';
import MenuIcon from '@mui/icons-material/Menu';
import SupportIcon from '@mui/icons-material/Support';
import VillaIcon from '@mui/icons-material/Villa';
import { Menu, MenuItem } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const drawerWidth = 240;

const menus = [
  {
    route: "Home",
    pathName: "/",
    icon: HouseIcon
  },
  {
    route: "Venue",
    pathName: "/venue",
    icon: VillaIcon
  },
  {
    route: "Supplier",
    pathName: "/supplier",
    icon: SupportIcon
  },
  {
    route: "About",
    pathName: "/about",
    icon: InfoIcon
  },
  {
    route: "Media",
    pathName: "/media",
    icon: MediationIcon
  },
  {
    route: "Contact Us",
    pathName: "/contact",
    icon: ContactsIcon
  }
];

const settings = [
  {
    route: "Profile",
    pathName: "/profile",
    icon: FaceIcon
  },
  {
    route: "Dashboard",
    pathName: "/dashboard",
    icon: DashboardIcon
  }
];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(1.5),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow: 'none',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const pathName = usePathname();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return pathName === path;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar className="fixed 3xl:static bg-white pt-3" open={open}>
        <Box className="flex justify-end items-center gap-8 mr-5 lg:mr-8">
          <Link href="/signin" className="text-black font-lora font-medium">SIGN IN</Link>
          <Link href="/signup" className="text-black font-lora font-medium px-10 py-1.5 bg-[#e1e1e1] hover:bg-[#c4c4c4] rounded-sm">SIGNUP</Link>
        </Box>
        <Box className="flex items-center justify-between">
          <Toolbar>
            <IconButton
              className="text-black lg:hidden"
              title="Open menu"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 2,
                },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon className="md:text-3xl" />
            </IconButton>
            <Typography className="text-xl 2xl:text-2xl font-bold font-lora text-black" noWrap component="div">
              <Link href="/">WedPlan BD</Link>
            </Typography>
          </Toolbar>
          <Box className="flex justify-end items-center">
            <section className="hidden xl:flex items-center justify-end">
              {menus.map((menu) => (
                <Link href={menu.pathName} key={menu.route} className={`font-lora font-medium mr-10 text-black ${isActive(menu.pathName) ? `font-semibold underline` : `hover:underline`}`}>
                  {menu.route}
                </Link>
              ))}
            </section>
            <section>
              <IconButton
                className="mr-2 lg:mr-5"
                title="Account of current user"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle className="text-black text-4xl" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.route} onClick={handleClose}>
                    <Link href={setting.pathName}
                      className={`font-medium font-lora ${isActive(setting.pathName) ? `font-semibold underline` : `hover:underline`}`}
                      textAlign="center">
                      <setting.icon className='mr-2' />
                      {setting.route}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </section>
          </Box>
        </Box>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <KeyboardBackspaceIcon /> : <EastIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menus.map((menu, index) => (
            <ListItem key={menu.route} disablePadding>
              <Link href={menu.pathName} className={`w-full font-medium font-lora`}>
                <ListItemButton className={`${isActive(menu.pathName) ? `font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : `hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline`}`} onClick={handleDrawerClose}>
                  <ListItemIcon>
                    <menu.icon />
                  </ListItemIcon>
                  {menu.route}
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
