// import Dropdown from "./Dropdown";
// import Link from "next/link";
// import { CircleUser, Menu, Package2, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";

// const Navbar = async () => {
// const { getUser, isAuthenticated } = getKindeServerSession();
// const isUserAuthenticated = await isAuthenticated();
// const user = await getUser();

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-md">
//       <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//         <Link
//           href="#"
//           className="flex items-center gap-2 text-lg font-semibold md:text-base"
//         >
//           <Package2 className="h-6 w-6" />
//           logo
//         </Link>
//         <Link
//           href="/rooms"
//           className="text-muted-foreground transition-colors hover:text-foreground"
//         >
//           Rooms
//         </Link>
//         <Link
//           href="/about"
//           className="text-muted-foreground transition-colors hover:text-foreground"
//         >
//           About
//         </Link>
//       </nav>
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="outline" size="icon" className="shrink-0 md:hidden">
//             <Menu className="h-5 w-5" />
//             <span className="sr-only">Toggle navigation menu</span>
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left">
//           <nav className="grid gap-6 text-lg font-medium">
//             <Link
//               href="#"
//               className="flex items-center gap-2 text-lg font-semibold"
//             >
//               <Package2 className="h-6 w-6" />
//               <span className="sr-only">Acme Inc</span>
//             </Link>
//             <Link
//               href="#"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Dashboard
//             </Link>
//             <Link
//               href="#"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Orders
//             </Link>
//           </nav>
//         </SheetContent>
//       </Sheet>
//       <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 ">
//         <form className="ml-auto flex-1 sm:flex-initial">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search products..."
//               className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
//             />
//           </div>
//         </form>
// {isUserAuthenticated ? (
//   <Dropdown user={user} isUserAuthenticated={isUserAuthenticated} />
// ) : (
//   <>
//     <LoginLink>
//       <Button className="w-full">Login</Button>
//     </LoginLink>
//     <RegisterLink>
//       <Button className="w-full">Register</Button>
//     </RegisterLink>
//   </>
// )}
//       </div>
//     </header>
//   );
// };

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Dropdown from "./Dropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
const navigation = {
  navlinks: [],
  pages: [
    { name: "Rooms", href: "/rooms" },
    { name: "Stores", href: "#" },
  ],
};

const Navbar = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  return (
    <div className="bg-white">
      {/* Mobile menu */}

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <Package2 className="h-6 w-6" />
                      <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link href="#" className="hover:text-foreground">
                      Dashboard
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Orders
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Products
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Customers
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Analytics
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="#">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </a>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                <div className="flex lg:ml-6">
                  <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-6 w-6"
                    />
                  </a>
                </div>
                <div className="ml-4  lg:hidden  lg:self-stretch">
                  <LoginLink className="group -m-2 flex items-center p-2">
                    <CircleUser
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </LoginLink>
                </div>

                <div className="ml-4 flow-root lg:ml-6 ">
                  {isUserAuthenticated ? (
                    <Dropdown
                      user={user}
                      isUserAuthenticated={isUserAuthenticated}
                    />
                  ) : (
                    <>
                      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                        <LoginLink className="text-sm font-medium text-gray-700 hover:text-gray-800">
                          Sign in
                        </LoginLink>
                        <span
                          aria-hidden="true"
                          className="h-6 w-px bg-gray-200"
                        />
                        <RegisterLink className="text-sm font-medium text-gray-700 hover:text-gray-800">
                          Create account
                        </RegisterLink>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
