import { cart } from "../../data/cart-class.js";

describe('test suite: addToCart',()=>{

  it('adds quantity to an existing item in the cart',()=>{
    spyOn(localStorage,'setItem');
    spyOn(localStorage,'getItem').and.callFake(()=>{
      return JSON.stringify([{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: "1"
      }])
    });
    cart.loadFromStorage();

    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.cartItems[0].quantity).toEqual(2);
  })


    it('adds a new item to the cart',()=>{
    spyOn(localStorage,'setItem');

    spyOn(localStorage,'getItem').and.callFake(()=>{
      return JSON.stringify([])
    });

    
    cart.loadFromStorage();

    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.cartItems[0].quantity).toEqual(1);
  })

  });
