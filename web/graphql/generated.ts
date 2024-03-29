import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: string;
};

export type ApplyTourInput = {
  tourId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateTourInput = {
  endingDate: Scalars['DateTime'];
  name: Scalars['String'];
  price: Scalars['Int'];
  startingDate: Scalars['DateTime'];
  travelId: Scalars['String'];
};

export type CreateTravelInput = {
  cultureMood?: InputMaybe<Scalars['Int']>;
  description: Scalars['String'];
  historyMood?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  natureMood?: InputMaybe<Scalars['Int']>;
  numberOfDays: Scalars['Int'];
  partyMood?: InputMaybe<Scalars['Int']>;
  relaxMood?: InputMaybe<Scalars['Int']>;
  slug: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  applyTour: Scalars['Boolean'];
  createTour: Tour;
  createTravel: Travel;
  deleteTour: Scalars['Boolean'];
  deleteTravel: Scalars['Boolean'];
  revokeTour: Scalars['Boolean'];
  updateTour: Tour;
  updateTravel: Travel;
};

export type MutationApplyTourArgs = {
  data: ApplyTourInput;
};

export type MutationCreateTourArgs = {
  data: CreateTourInput;
};

export type MutationCreateTravelArgs = {
  data: CreateTravelInput;
};

export type MutationDeleteTourArgs = {
  id: Scalars['String'];
};

export type MutationDeleteTravelArgs = {
  id: Scalars['String'];
};

export type MutationRevokeTourArgs = {
  data: RevokeTourInput;
};

export type MutationUpdateTourArgs = {
  data: UpdateTourInput;
};

export type MutationUpdateTravelArgs = {
  data: UpdateTravelInput;
};

export type PaginatedTours = {
  __typename?: 'PaginatedTours';
  count: Scalars['Int'];
  items: Array<Tour>;
};

export type PaginatedTravels = {
  __typename?: 'PaginatedTravels';
  count: Scalars['Int'];
  items: Array<Travel>;
};

export type Query = {
  __typename?: 'Query';
  tour: Tour;
  toursByTravel: PaginatedTours;
  travel: Travel;
  travels: PaginatedTravels;
};

export type QueryTourArgs = {
  id: Scalars['String'];
};

export type QueryToursByTravelArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']>;
  dateTo?: InputMaybe<Scalars['DateTime']>;
  page?: InputMaybe<Scalars['Int']>;
  priceFrom?: InputMaybe<Scalars['Int']>;
  priceTo?: InputMaybe<Scalars['Int']>;
  rows?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ToursSortBy>;
  travelSlug: Scalars['String'];
};

export type QueryTravelArgs = {
  id: Scalars['String'];
};

export type QueryTravelsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  rows?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
};

export type RevokeTourInput = {
  tourId: Scalars['String'];
  userId: Scalars['String'];
};

export enum Role {
  Organizer = 'ORGANIZER',
  Traveler = 'TRAVELER',
}

export type Tour = {
  __typename?: 'Tour';
  createdAt: Scalars['DateTime'];
  endingDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  price: Scalars['Int'];
  startingDate: Scalars['DateTime'];
  travel: Travel;
  updatedAt: Scalars['DateTime'];
  users: Array<User>;
};

export enum ToursSortBy {
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC',
}

export type Travel = {
  __typename?: 'Travel';
  createdAt: Scalars['DateTime'];
  cultureMood: Scalars['Int'];
  description: Scalars['String'];
  historyMood: Scalars['Int'];
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  name: Scalars['String'];
  natureMood: Scalars['Int'];
  numberOfDays: Scalars['Float'];
  partyMood: Scalars['Int'];
  relaxMood: Scalars['Int'];
  slug: Scalars['String'];
  tours: Array<Tour>;
  updatedAt: Scalars['DateTime'];
};

export type UpdateTourInput = {
  endingDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Int']>;
  startingDate?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateTravelInput = {
  cultureMood?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  historyMood?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  natureMood?: InputMaybe<Scalars['Int']>;
  numberOfDays?: InputMaybe<Scalars['Int']>;
  partyMood?: InputMaybe<Scalars['Int']>;
  relaxMood?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  role: Role;
  tours: Array<Tour>;
  updatedAt: Scalars['DateTime'];
};

export type TravelsQueryVariables = Exact<{
  page: Scalars['Int'];
  rows: Scalars['Int'];
  searchTerm?: InputMaybe<Scalars['String']>;
}>;

export type TravelsQuery = {
  __typename?: 'Query';
  travels: {
    __typename?: 'PaginatedTravels';
    count: number;
    items: Array<{
      __typename?: 'Travel';
      id: string;
      name: string;
      slug: string;
      isPublic: boolean;
      numberOfDays: number;
    }>;
  };
};

export type TravelQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type TravelQuery = {
  __typename?: 'Query';
  travel: {
    __typename?: 'Travel';
    id: string;
    name: string;
    slug: string;
    description: string;
    numberOfDays: number;
    isPublic: boolean;
    natureMood: number;
    relaxMood: number;
    historyMood: number;
    cultureMood: number;
    partyMood: number;
  };
};

export type CreateTravelMutationVariables = Exact<{
  data: CreateTravelInput;
}>;

export type CreateTravelMutation = {
  __typename?: 'Mutation';
  createTravel: { __typename?: 'Travel'; id: string };
};

export type UpdateTravelMutationVariables = Exact<{
  data: UpdateTravelInput;
}>;

export type UpdateTravelMutation = {
  __typename?: 'Mutation';
  updateTravel: { __typename?: 'Travel'; id: string };
};

export type DeleteTravelMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type DeleteTravelMutation = {
  __typename?: 'Mutation';
  deleteTravel: boolean;
};

export type ToursByTravelQueryVariables = Exact<{
  travelSlug: Scalars['String'];
  page: Scalars['Int'];
  rows: Scalars['Int'];
}>;

export type ToursByTravelQuery = {
  __typename?: 'Query';
  toursByTravel: {
    __typename?: 'PaginatedTours';
    count: number;
    items: Array<{
      __typename?: 'Tour';
      id: string;
      name: string;
      startingDate: string;
      endingDate: string;
      price: number;
      users: Array<{ __typename?: 'User'; id: string }>;
    }>;
  };
};

export type TourQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type TourQuery = {
  __typename?: 'Query';
  tour: {
    __typename?: 'Tour';
    id: string;
    name: string;
    startingDate: string;
    endingDate: string;
    price: number;
    users: Array<{ __typename?: 'User'; id: string }>;
  };
};

export type CreateTourMutationVariables = Exact<{
  data: CreateTourInput;
}>;

export type CreateTourMutation = {
  __typename?: 'Mutation';
  createTour: { __typename?: 'Tour'; id: string };
};

export type UpdateTourMutationVariables = Exact<{
  data: UpdateTourInput;
}>;

export type UpdateTourMutation = {
  __typename?: 'Mutation';
  updateTour: { __typename?: 'Tour'; id: string };
};

export type DeleteTourMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type DeleteTourMutation = {
  __typename?: 'Mutation';
  deleteTour: boolean;
};

export type ApplyTourMutationVariables = Exact<{
  data: ApplyTourInput;
}>;

export type ApplyTourMutation = { __typename?: 'Mutation'; applyTour: boolean };

export type RevokeTourMutationVariables = Exact<{
  data: RevokeTourInput;
}>;

export type RevokeTourMutation = {
  __typename?: 'Mutation';
  revokeTour: boolean;
};

export const Travels = gql`
  query Travels($page: Int!, $rows: Int!, $searchTerm: String) {
    travels(page: $page, rows: $rows, searchTerm: $searchTerm) {
      items {
        id
        name
        slug
        isPublic
        numberOfDays
      }
      count
    }
  }
`;
export const Travel = gql`
  query Travel($id: String!) {
    travel(id: $id) {
      id
      name
      slug
      description
      numberOfDays
      isPublic
      natureMood
      relaxMood
      historyMood
      cultureMood
      partyMood
    }
  }
`;
export const CreateTravel = gql`
  mutation CreateTravel($data: CreateTravelInput!) {
    createTravel(data: $data) {
      id
    }
  }
`;
export const UpdateTravel = gql`
  mutation UpdateTravel($data: UpdateTravelInput!) {
    updateTravel(data: $data) {
      id
    }
  }
`;
export const DeleteTravel = gql`
  mutation DeleteTravel($id: String!) {
    deleteTravel(id: $id)
  }
`;
export const ToursByTravel = gql`
  query ToursByTravel($travelSlug: String!, $page: Int!, $rows: Int!) {
    toursByTravel(travelSlug: $travelSlug, page: $page, rows: $rows) {
      items {
        id
        name
        startingDate
        endingDate
        price
        users {
          id
        }
      }
      count
    }
  }
`;
export const Tour = gql`
  query Tour($id: String!) {
    tour(id: $id) {
      id
      name
      startingDate
      endingDate
      price
      users {
        id
      }
    }
  }
`;
export const CreateTour = gql`
  mutation CreateTour($data: CreateTourInput!) {
    createTour(data: $data) {
      id
    }
  }
`;
export const UpdateTour = gql`
  mutation UpdateTour($data: UpdateTourInput!) {
    updateTour(data: $data) {
      id
    }
  }
`;
export const DeleteTour = gql`
  mutation DeleteTour($id: String!) {
    deleteTour(id: $id)
  }
`;
export const ApplyTour = gql`
  mutation ApplyTour($data: ApplyTourInput!) {
    applyTour(data: $data)
  }
`;
export const RevokeTour = gql`
  mutation RevokeTour($data: RevokeTourInput!) {
    revokeTour(data: $data)
  }
`;
