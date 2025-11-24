export const prismaMock = {
  userMock: (user: any) => ({
    prisma: {
      user: {
        findUnique: () => Promise.resolve(user),
      },
    },
  }),
};
