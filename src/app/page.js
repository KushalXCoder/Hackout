import CoastalDashboard from "./components/dashboard";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="app h-screen w-screen">
      <CoastalDashboard />
      <Footer/>
    </div>
  );
}
