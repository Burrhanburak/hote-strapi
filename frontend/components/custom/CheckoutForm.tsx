// "use client";
// import React, { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useToast } from "@/components/ui/use-toast";
// import { v4 as uuidv4 } from "uuid";
// import { fetchCartItems } from "@/actions/fetchCartItems";
// import { createOrder } from "@/actions/createOrder"; // import the createOrder function
// import { DeleteToCart } from "@/actions/deleteToCart";
// import { getUserMeLoader } from "@/lib/services/get-user-me-loader";

// const formSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters." }),
//   phone: z.string().min(2, { message: "Phone must be at least 2 characters." }),
//   address: z
//     .string()
//     .min(2, { message: "Address must be at least 2 characters." }),
//   holdername: z
//     .string()
//     .min(2, { message: "Holder Name must be at least 2 characters." }),
//   ccnumber: z
//     .string()
//     .regex(/^\d{16}$/, { message: "Credit Number must be 16 digits." }),
//   month: z.preprocess((val) => Number(val), z.number().min(1).max(12)),
//   year: z.preprocess(
//     (val) => Number(val),
//     z.number().min(new Date().getFullYear())
//   ),
//   cvc: z.string().regex(/^\d{3,4}$/, { message: "CVC must be 3 or 4 digits." }),
// });

// interface CheckoutFormProps {
//   subtotal: string;
//   userId: string;
//   jwt: string;
//   items: any[];
// }

// const CheckoutForm: React.FC<CheckoutFormProps> = ({
//   subtotal,
//   userId,
//   jwt,
//   items,
// }) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [cartItems, setCartItems] = useState(items);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       phone: "",
//       address: "",
//       holdername: "",
//       ccnumber: "",
//       month: "",
//       year: "",
//       cvc: "",
//     },
//   });

//   const onSubmit = async (data: any) => {
//     const paymentCard = {
//       cardHolderName: data.holdername,
//       cardNumber: data.ccnumber,
//       expireMonth: data.month,
//       expireYear: data.year,
//       cvc: data.cvc,
//       registerCard: "0",
//     };

//     const buyer = {
//       id: userId,
//       name: data.name,
//       surname: "Youtube",
//       gsmNumber: data.phone,
//       email: "mail@gmail.com",
//       identityNumber: "74300864791",
//       lastLoginDate: "2015-10-05 12:43:35",
//       registrationDate: "2013-04-21 15:12:09",
//       registrationAddress: data.address,
//       ip: "85.34.78.112",
//       city: "Istanbul",
//       country: "Turkey",
//       zipCode: "34890",
//     };

//     const shippingAddress = {
//       contactName: data.name,
//       city: "Istanbul",
//       country: "Turkey",
//       address: data.address,
//       zipCode: "34890",
//     };

//     const billingAddress = {
//       contactName: data.name,
//       city: "Istanbul",
//       country: "Turkey",
//       address: data.address,
//       zipCode: "34890",
//     };

//     const basketItems = items.map((item) => ({
//       id: uuidv4(),
//       price: item.attributes.amount.toString(),
//       name: item.attributes.name || "Default Item Name", // Varsayılan isim
//       category1: "Hotels",
//       category2: "Reservation",
//       itemType: "VIRTUAL",
//       subMerchantPrice: (item.attributes.amount * 0.9).toString(),
//       subMerchantKey: uuidv4(),
//     }));

//     const payload = {
//       locale: "TR",
//       conversationId: uuidv4(),
//       price: subtotal,
//       paidPrice: subtotal,
//       basketId: "B67832",
//       paymentChannel: "WEB",
//       paymentGroup: "PRODUCT",
//       paymentCard: paymentCard,
//       buyer: buyer,
//       shippingAddress: shippingAddress,
//       billingAddress: billingAddress,
//       basketItems: basketItems,
//     };
//     console.log("payload iyzico", payload);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/payment",
//         payload
//       );

//       console.log("response iyzico", response);

//       if (response.status === 200) {
//         const orderPayload = {
//           data: {
//             name: data.name,
//             address: data.address,
//             phone: data.phone,
//             userId: userId,
//             status: "completed",
//             order_date: new Date().toISOString(),
//             users_permissions_user: userId,
//             services: items.map((item) => item.attributes.extraServices).flat(),
//             subtotal: subtotal,
//             paymentText: "Iyzico",
//             OrderItemList: items.map((item) => ({
//               quantity: item.attributes.quantity,
//               amount: item.attributes.amount,
//               extraServices: item.attributes.extraServices,
//               reservation: item.attributes.reservations?.data[0]?.id,
//             })),
//           },
//         };
//         await createOrder(orderPayload, jwt);
//         items.forEach((item) => DeleteToCart(item.id, jwt));
//         setCartItems([]); // Clear t

//         // Remove cart items from local storage
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("cartItems");
//         }

//         toast({
//           title: "Payment successful.",
//           description: "Your order has been confirmed.",
//           variant: "default",
//         });
//         const userResponse = await getUserMeLoader();
//         const user = userResponse.data;
//         await fetchCartItems(Number(userId), user.jwt);
//         router.push("/order-confirmation");
//       } else {
//         toast({
//           title: "Payment failed.",
//           description: "Please check your payment details and try again.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       toast({
//         title: "Payment error.",
//         description: "An error occurred while processing your payment.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-6 bg-white p-6 rounded-lg shadow-md"
//       >
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone</FormLabel>
//               <FormControl>
//                 <Input placeholder="Phone" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="address"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Address</FormLabel>
//               <FormControl>
//                 <Input placeholder="Address" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="holdername"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Holder Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Holder Name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="ccnumber"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Credit Card Number</FormLabel>
//               <FormControl>
//                 <Input placeholder="Credit Card Number" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="month"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Expiry Month</FormLabel>
//               <FormControl>
//                 <Input placeholder="MM" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="year"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Expiry Year</FormLabel>
//               <FormControl>
//                 <Input placeholder="YYYY" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="cvc"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>CVC</FormLabel>
//               <FormControl>
//                 <Input placeholder="CVC" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" className="w-full">
//           Submit
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default CheckoutForm;

"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { fetchCartItems } from "@/actions/fetchCartItems";
import { createOrder } from "@/actions/createOrder"; // import the createOrder function
import { DeleteToCart } from "@/actions/deleteToCart";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(2, { message: "Phone must be at least 2 characters." }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters." }),
  holdername: z
    .string()
    .min(2, { message: "Holder Name must be at least 2 characters." }),
  ccnumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Credit Number must be 16 digits." }),
  month: z.preprocess((val) => Number(val), z.number().min(1).max(12)),
  year: z.preprocess(
    (val) => Number(val),
    z.number().min(new Date().getFullYear())
  ),
  cvc: z.string().regex(/^\d{3,4}$/, { message: "CVC must be 3 or 4 digits." }),
});

interface CheckoutFormProps {
  subtotal: string;
  userId: string;
  jwt: string;
  items: any[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  subtotal,
  userId,
  jwt,
  items,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(items);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      holdername: "",
      ccnumber: "",
      month: "",
      year: "",
      cvc: "",
    },
  });

  const onSubmit = async (data: any) => {
    const paymentCard = {
      cardHolderName: data.holdername,
      cardNumber: data.ccnumber,
      expireMonth: data.month,
      expireYear: data.year,
      cvc: data.cvc,
      registerCard: "0",
    };

    const buyer = {
      id: userId,
      name: data.name,
      surname: "Youtube",
      gsmNumber: data.phone,
      email: "mail@gmail.com",
      identityNumber: "74300864791",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      registrationAddress: data.address,
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34890",
    };

    const shippingAddress = {
      contactName: data.name,
      city: "Istanbul",
      country: "Turkey",
      address: data.address,
      zipCode: "34890",
    };

    const billingAddress = {
      contactName: data.name,
      city: "Istanbul",
      country: "Turkey",
      address: data.address,
      zipCode: "34890",
    };

    const basketItems = items.map((item) => ({
      id: uuidv4(),
      price: (item.attributes.amount * item.attributes.quantity).toString(),
      name: item.attributes.name || "Default Item Name", // Varsayılan isim
      category1: "Hotels",
      category2: "Reservation",
      itemType: "VIRTUAL",
    }));
    const calculatedTotal = basketItems
      .reduce((sum, item) => sum + parseFloat(item.price), 0)
      .toFixed(2);

    const payload = {
      locale: "TR",
      conversationId: uuidv4(),
      price: calculatedTotal,
      paidPrice: calculatedTotal,
      basketId: "B67832",
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      paymentCard: paymentCard,
      buyer: buyer,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems,
    };
    console.log("payload iyzico", payload);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment",
        payload
      );

      console.log("response iyzico", response);

      if (response.status === 200) {
        const orderPayload = {
          data: {
            name: data.name,
            address: data.address,
            phone: data.phone,
            userId: userId,
            status: "completed",
            order_date: new Date().toISOString(),
            users_permissions_user: userId,
            services: items.map((item) => item.attributes.extraServices).flat(),
            subtotal: subtotal,
            paymentText: "Iyzico",
            OrderItemList: items.map((item) => ({
              quantity: item.attributes.quantity,
              amount: item.attributes.amount,
              extraServices: item.attributes.extraServices,
              reservation: item.attributes.reservations?.data[0]?.id,
            })),
          },
        };
        await createOrder(orderPayload, jwt);
        items.forEach((item) => DeleteToCart(item.id, jwt));
        setCartItems([]); // Clear t

        // Remove cart items from local storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("cartItems");
        }

        toast({
          title: "Payment successful.",
          description: "Your order has been confirmed.",
          variant: "default",
        });
        const userResponse = await getUserMeLoader();
        const user = userResponse.data;
        await fetchCartItems(Number(userId), user.jwt);
        router.push("/order-confirmation");
      } else {
        toast({
          title: "Payment failed.",
          description: "Please check your payment details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error.",
        description: "An error occurred while processing your payment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="holdername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Holder Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ccnumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit Card Number</FormLabel>
              <FormControl>
                <Input placeholder="Credit Card Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Month</FormLabel>
              <FormControl>
                <Input placeholder="MM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Year</FormLabel>
              <FormControl>
                <Input placeholder="YYYY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cvc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVC</FormLabel>
              <FormControl>
                <Input placeholder="CVC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutForm;
