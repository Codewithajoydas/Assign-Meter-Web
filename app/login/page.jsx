import "../globals.css";
import SigninFrom from "../../components/SigninForm";
export const metadata = {
  title: "Sign In | Assign Meter | Genus Power Infrastructure Ltd.",
};
export default function LoginPage() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <SigninFrom />
    </div>
  );
}
