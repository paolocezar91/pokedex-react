import Footer from "@/components/layout/footer";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/layout/version-info", () =>
  jest.fn(() => <div>Version Info</div>)
);

jest.mock("@/components/settings/lang-select", () =>
  jest.fn(() => <div>Lang Select</div>)
);

describe("Footer", () => {
  it("should match snapshot with no valid description", () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
