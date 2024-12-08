export type Category = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    image: {
      data: any;
      url: string;
    };
  };
};

export type Room = {
  slug: number;
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    slug: string;
    type: string;
    availability: boolean;
    room_number: number;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    price: number;
  };
};

export type ExtraService = {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    category: string;
  };
};
export type CartItem = {
  id: number;
  attributes: {
    name: string;
    amount: number; // Change from price to amount
    quantity: number;
  };
};
