import { getUserStatsPlain } from "../fetch-adapter";

test("fetch user stats plain html should be not emapty", () => {
  const uid = "uYMx9DHw09rvbi5iFNzH";
  expect(getUserStatsPlain(uid)).resolves.not.toBe(undefined);
});
