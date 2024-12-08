"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingBasketIcon } from "lucide-react";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import { Logo } from "@/components/custom/Logo";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./LogoutButton";
import cookie from "js-cookie"; // Ensure this is imported

interface HeaderProps {
  data: {
    logoText: {
      id: number;
      text: string;
      url: string;
    };
    ctaButton: {
      id: number;
      text: string;
      url: string;
    };
  };
}

interface AuthUserProps {
  id: number; // Ensure id is included in the AuthUserProps
  username: string;
  email: string;
}

async function fetchCartItems(userId: number) {
  try {
    const token = cookie.get("jwt");
    if (!token) throw new Error("JWT token not found");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/carts`,
      {
        params: {
          filters: {
            users_permissions_user: {
              $eq: userId,
            },
          },
          populate: "*",
        },
        ...config,
      }
    );

    return response.data.data || [];
  } catch (error: any) {
    console.error(
      "Error fetching cart items:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export function LoggedInUser({
  userData,
}: {
  readonly userData: AuthUserProps;
}) {
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard/account"
        className="font-semibold hover:text-primary"
      >
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}

export function Header({ data }: Readonly<HeaderProps>) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState<{
    ok: boolean;
    data: AuthUserProps | null;
    error: any;
  } | null>(null);

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const userResponse = await getUserMeLoader();
        setUser(userResponse);

        if (userResponse.ok && userResponse.data) {
          const cartItems = await fetchCartItems(userResponse.data.id);
          setCartItemCount(cartItems.length);
        }
      } catch (error) {
        console.error("Error fetching user and cart items:", error);
      }
    };

    fetchUserAndCart();
  }, []);

  const { logoText, ctaButton } = data;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
      <Logo text={logoText.text} />
      <div className="flex items-center gap-4">
        {user?.ok ? (
          <LoggedInUser userData={user.data!} />
        ) : (
          <Link href={ctaButton.url}>
            <Button>{ctaButton.text}</Button>
          </Link>
        )}
        <Link href="/cart" className="relative">
          <ShoppingBasketIcon />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
