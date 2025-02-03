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
  signin: {
    label: "Entrar",
    href: "/auth/signin",
  },
  signup: {
    label: "Cadastrar",
    href: "/auth/signup",
  },
  profile: {
    label: "Perfil",
    href: "/profile",
  },
} satisfies Links;
