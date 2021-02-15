import React from 'react';
import { Link } from "gatsby"
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import { useStaticQuery, graphql } from "gatsby"
import Icon from '@material-ui/core/Icon';
import { Container } from '@material-ui/core';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      display: 'none',
    },
  },
  hamburgerMenu: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  appBar: {
    backgroundColor: "#fafafa",
    color: "#202020"
  },
  menuButton: {
    display: 'none',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'initial',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  //  padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function Header(props) {
  const data = useStaticQuery(graphql`
    query navQuery {
      settingsJson(fileRelativePath: { eq: "/content/settings/menu.json" }) {
        ...nav
      }
    }
  `)

  const menu = data.settingsJson
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
       { menu.menuItems.map((item) => { 
          return (
            <ListItem key={item.id} button key={item.label}>
              <Link to={item.link}>
                  <ListItemIcon>
                  <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                <ListItemText primary={item.label} />
              </Link>
            </ListItem>
          );
          })}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
        <AppBar elevation={0} position="fixed" className={classes.appBar}>
          <Container maxWidth="lg">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.hamburgerMenu}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title} noWrap>
              {props.siteTitle}
              </Typography>
              <div>
                {menu.menuItems.map(item => (
                  <Button className={classes.menuButton} href={item.link} color="inherit">{item.label}</Button>
                ))}
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

export default Header;

export const navFragment = graphql`
  fragment nav on SettingsJson {
    menuItems {
      link
      label
      icon
    }
  }
`

export const NavForm = {
  label: "Menu",
  fields: [
    {
      label: "Main Menu",
      name: "rawJson.menuItems",
      component: "group-list",
      itemProps: item => ({
        label: item.label,
      }),
      fields: [
        {
          label: "Icon",
          name: "icon",
          component: "text",
          parse(value) {
            return value || ""
          },
        },        
        {
          label: "Label",
          name: "label",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
        {
          label: "Link",
          name: "link",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
        {
          label: "Sub Menu",
          name: "subMenu",
          component: "group-list",
          itemProps: item => ({
            key: item.link,
            label: item.label,
            icon: item.icon,
          }),
          fields: [
            {
              label: "Icon",
              name: "Icon",
              component: "text",
            },
            {
              label: "Label",
              name: "label",
              component: "text",
            },
            {
              label: "Link",
              name: "link",
              component: "text",
            },
            {
              label: "Sub Menu",
              name: "subMenu",
              component: "group-list",
              itemProps: item => ({
                key: item.link,
                label: item.label,
                icon: item.icon,
              }),
              fields: [
                {
                  label: "Icon",
                  name: "Icon",
                  component: "text",
                },
                {
                  label: "Label",
                  name: "label",
                  component: "text",
                },
                {
                  label: "Link",
                  name: "link",
                  component: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}