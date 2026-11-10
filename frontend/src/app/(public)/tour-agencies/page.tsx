import { redirect } from "next/navigation";

export default function TourAgenciesRedirectPage() {
  redirect("/tours?providerType=TOUR_AGENCY");
}
