import MobileHeader from "@/components/mobile-header";
import Sidebar from "@/components/sidebar";

type Props = {
  children: React.ReactNode
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <MobileHeader />
      <Sidebar clasName="hidden lg:flex"/>
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="bg-red-500 h-full">
        {children}
        </div>
      </main>
    </>
  );
}