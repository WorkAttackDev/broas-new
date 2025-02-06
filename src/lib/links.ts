type Link = {
  label: string;
  href: string;
};

type Links = {
  [key: string]: Link;
};

export const links = {
  home: {
    label: "Página Inicial",
    href: "/",
  },
  signOn: {
    label: "Entrar",
    href: "/auth/sign-on",
  },
  profile: {
    label: "Perfil",
    href: "/profile",
  },
} satisfies Links;
