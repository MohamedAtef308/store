"use client";
import { adminLinks } from "@/utils/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside>
      {adminLinks.map((link) => (
        <Button
          key={link.label}
          className="w-full mb-2 capitalize font-normal justify-start"
          variant={pathname === link.href ? "default" : "ghost"}
          asChild
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </aside>
  );
}

export default Sidebar;
