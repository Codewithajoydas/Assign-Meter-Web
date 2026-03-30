import "../globals.css";
import SignupForm from "@/components/SignupForm";
export const metadata = {
  title: "Sign In | Assign Meter | Genus Power Infrastructure Ltd.",
};
export default function LoginPage() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <SignupForm />
    </div>
  );
}
