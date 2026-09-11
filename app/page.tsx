import TenantPage from "./components/storePage/store-page";
import { struct } from "@/app/lib/utils"

export default function Home() {
  return <TenantPage data={struct} />;
}
