"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import { fetchCartItems } from "@/actions/fetchCartItems";

const OrderPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [jwt, setJwt] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      let jwtToken = "";
      if (typeof window !== "undefined") {
        jwtToken = localStorage.getItem("jwt") || "";
        setJwt(jwtToken);
      }

      if (jwtToken) {
        try {
          const userResponse = await getUserMeLoader();
          if (userResponse && userResponse.data) {
            const userData = userResponse.data;
            setUser(userData);
            setUserId(userData.id);
          } else {
            setError("Invalid user data received.");
          }
        } catch (err) {
          setError("Error fetching user data.");
        }
      } else {
        setError("JWT token is missing.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId && jwt) {
      fetchCartItems(Number(userId), user.jwt);
    }
  }, [userId, jwt]);

  return (
    <div>
      <h1>Order Confirmation</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Your order has been confirmed!</p>
          <Link href="/dashboard">
            <p>Go to Dashboard</p>
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderPage;
