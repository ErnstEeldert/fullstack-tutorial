import React from 'react'; // preserve-line
import { useMutation } from '@apollo/react-hooks'; // preserve-line
import gql from 'graphql-tag';

import Button from '../components/button'; // preserve-line
import { GET_LAUNCH } from './cart-item'; // preserve-line
import * as GetCartItemsTypes from '../pages/__generated__/GetCartItems';
import * as BookTripsTypes from './__generated__/BookTrips';

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface BookTripsProps extends GetCartItemsTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({ cartItems }) => {
  const [
    bookTrips, { data }
  ] = useMutation<
    BookTripsTypes.BookTrips, 
    BookTripsTypes.BookTripsVariables
  > (
    BOOK_TRIPS,
    {
      variables: { launchIds: cartItems },
      refetchQueries: cartItems.map(launchId => ({
        query: GET_LAUNCH,
        variables: { launchId },
      })),

      update(cache) {
        cache.writeData({ data: { cartItems: [] } });
      }
    }
  );

  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
      <Button 
        onClick={() => bookTrips()} 
        data-testid="book-button">
        Book All
      </Button>
    );
}

export default BookTrips;

