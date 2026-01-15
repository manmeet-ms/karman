 
 import { LandingFooter } from "@/components/Footer";
 export default async function MarketingLayout({
  children,
}) {

  return (
 
        <>
<div className="sticky top-0 z-40">sep header  </div>      
          {children}

 <LandingFooter/>
</>
        
  );
}
