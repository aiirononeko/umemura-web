"use client";

import { useContext, useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Center,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { AuthContext } from "@/app/firebase/service/authContext";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const HEADER_HEIGHT = rem(80);

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string; onClick: () => void }[];
}

function logout() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("logout");
      window.alert("ログアウトしました");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
      window.alert(error);
    });
}

export default function HeaderResponsive() {
  const { user } = useContext(AuthContext);
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const initLinks: HeaderResponsiveProps = {
    links: [
      { link: "/admin", label: "予約", onClick: () => {} },
      {
        link: "/admin/availableTime",
        label: "予約可能日時",
        onClick: () => {},
      },
      {
        link: "/admin/reservation/offline",
        label: "オフライン予約",
        onClick: () => {},
      },
      {
        link: "/admin/stuff/profile",
        label: "プロフィール",
        onClick: () => {},
      },
      { link: "/admin/course", label: "コース", onClick: () => {} },
      { link: "/admin/stuff", label: "スタッフ", onClick: () => {} },
    ],
  };
  const { links } = initLinks;
  const [active, setActive] = useState(links[0].label);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.label,
      })}
      onClick={(_event) => {
        link.onClick();
        setActive(link.label);
        close();
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={10} className={classes.root}>
      <Container className={classes.header}>
        {user && (
          <>
            <Group spacing={5} className={classes.links}>
              {items}
            </Group>

            <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
            />
          </>
        )}
        <Center mx="auto">
          <Image src="/HeaderLogo.svg" alt="logo" />
        </Center>

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
