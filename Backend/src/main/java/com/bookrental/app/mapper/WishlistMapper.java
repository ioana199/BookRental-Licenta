package com.bookrental.app.mapper;

import com.bookrental.app.dto.WishlistRequestDTO;
import com.bookrental.app.dto.WishlistResponseDTO;
import com.bookrental.app.entities.Wishlist;

public class WishlistMapper {
    public static Wishlist mapWishlistDTO2Wishlist(WishlistRequestDTO wishlistRequestDTO) {
        Wishlist wishlist = new Wishlist();

        wishlist.setDate(wishlistRequestDTO.getDate());

        return wishlist;
    }

    public static WishlistResponseDTO mapWishlist2WishlistDTO(Wishlist wishlist) {
        WishlistResponseDTO wishlistResponseDTO = new WishlistResponseDTO();

        wishlistResponseDTO.setId(wishlist.getId());
        wishlistResponseDTO.setDate(wishlist.getDate());
        wishlistResponseDTO.setBookName(wishlist.getBook().getTitle());
        wishlistResponseDTO.setUserFirstName(wishlist.getUser().getFirstName());

        return wishlistResponseDTO;
    }
}
