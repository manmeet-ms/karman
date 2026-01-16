
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconBarrierBlock, IconHeartFilled } from "@tabler/icons-react";

import Link from "next/link";

 


const ComingSoon = () => {
  return (
    <>
    <Empty className="opacity-40 container w-full mx-auto" >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBarrierBlock />
        </EmptyMedia>
        <EmptyTitle>Coming Soon</EmptyTitle>
        <EmptyDescription>
          We are working hard to bring you the best experience
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2 group">
          <Button>Contact</Button>
          <Link href="https://buymeacoffee.com/manmeets">
          <Button variant="outline">Support <IconHeartFilled className="group:hove text-muted inline-flex items-center  " /></Button>
          </Link>
        </div>
      </EmptyContent>
      <Button
        variant="link"
         
        className="text-muted-foreground"
        size="sm"
      >
         
          Back to Work
         
      </Button>
    </Empty>
    </>
    // <section className={cn("p-8 bg-card relative overflow-hidden  rounded-2xl", className)}>
    //   <div className="container">
    //     <div className="flex flex-col items-center gap-5">
    //       <img src="/logo.svg" alt="logo" className="size-10" />
    //       {/* <img src="/logo.svg" alt="logo" className="-mx-10  -my-20  size-200 absolute inset-0 opacity-5  grayscale" /> */}
    //       <h2 className="text-center text-3xl font-semibold" >
    //         <span className="text-muted-foreground/80">
    //          Coming Soon
    //         </span>
    //         <br />
    //          We are working hard to bring you the best experience
    //       </h2>
    //       <div className="flex items-center gap-4">
    //         <Button size="lg" variant="outline" asChild>
    //           <a
    //             href="https://x.com/shadcnblocks"
    //             target="_blank"
    //             className="size-10"
    //           >
    //             <FaXTwitter />
    //           </a>
    //         </Button>
    //         <Button size="lg" variant="outline" asChild>
    //           <a
    //             href="https://github.com/shadcnblocks"
    //             target="_blank"
    //             className="size-10"
    //           >
    //             <FaGithub />
    //           </a>
    //         </Button>
    //         <Button size="lg" variant="outline" asChild>
    //           <a
    //             href="https://shadcnblocks.com"
    //             target="_blank"
    //             className="size-10"
    //           >
    //             <FaDiscord />
    //           </a>
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

export { ComingSoon };
