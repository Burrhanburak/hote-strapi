import type { Schema, Attribute } from '@strapi/strapi';

export interface LayoutHeader extends Schema.Component {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    logoText: Attribute.Component<'components.link'>;
    ctaButton: Attribute.Component<'components.link'>;
  };
}

export interface LayoutFooter extends Schema.Component {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    logoText: Attribute.Component<'components.link'>;
    text: Attribute.Text;
    socialLink: Attribute.Component<'components.link', true>;
  };
}

export interface OrderItemListOrderItemList extends Schema.Component {
  collectionName: 'components_order_item_list_order_item_lists';
  info: {
    displayName: 'OrderItemList';
    description: '';
  };
  attributes: {
    amount: Attribute.Decimal;
    extraServices: Attribute.JSON;
    reservation: Attribute.Relation<
      'order-item-list.order-item-list',
      'oneToOne',
      'api::reservation.reservation'
    >;
    quantity: Attribute.Integer;
  };
}

export interface ComponentsLink extends Schema.Component {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    url: Attribute.String;
    text: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'layout.header': LayoutHeader;
      'layout.footer': LayoutFooter;
      'order-item-list.order-item-list': OrderItemListOrderItemList;
      'components.link': ComponentsLink;
    }
  }
}
