import { Right, type Either, Left } from "../domain/Either";
import type { LegoSetListType } from "../domain/LegoSetListType";
import { LegoPartType } from "../domain/LegoPartType";

export type GetUserSetsError = string;
export type GetSetError = string;

export const getUserSets = async (
  apiKey: string,
  userToken: string
): Promise<Either<GetUserSetsError, LegoSetListType[]>> => {
  const fetchResult = await fetch(
    `https://rebrickable.com/api/v3/users/${userToken}/sets/`,
    {
      method: "GET",
      headers: {
        Authorization: `key ${apiKey}`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const right = data.results.map((result: RebrickableUserSetList) =>
        mapUserSetsToDomain(result)
      );
      return Right.create(right);
    })
    .catch((error) => {
      return Left.create(error.message as GetUserSetsError);
    });

  return fetchResult;
};

export const getSet = async (
  apiKey: string,
  setNum: string
): Promise<Either<GetSetError, LegoPartType[]>> => {
  const fetchResult = await fetch(
    `https://rebrickable.com/api/v3/lego/sets/${setNum}/parts/?inc_minifig_parts=1&page_size=1000`,
    {
      method: "GET",
      headers: {
        Authorization: `key ${apiKey}`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const right = data.results.map((result: RebrickablePart) =>
        mapSetPartsToDomain(result)
      );
      // return Left.create("need to forge right" as GetUserSetsError);
      return Right.create(right);
    })
    .catch((error) => {
      return Left.create(error.message as GetUserSetsError);
    });
  return fetchResult;
};

type RebrickableUserSetList = {
  set: RebrickableUserSet;
};

type RebrickableUserSet = {
  name: string;
  set_img_url: string;
  set_num: string;
};

type RebrickablePart = {
  color: {
    name: string;
  };
  id: string;
  part: {
    name: string;
    part_img_url: string;
  };
  quantity: number;
};

const mapUserSetsToDomain = (
  userSet: RebrickableUserSetList
): LegoSetListType => {
  return {
    name: userSet.set.name,
    imgUrl: userSet.set.set_img_url,
    num: userSet.set.set_num,
  };
};

const mapSetPartsToDomain = (part: RebrickablePart): LegoPartType => {
  return {
    id: part.id,
    color: part.color.name,
    name: part.part.name,
    imgUrl: part.part.part_img_url,
    quantity: part.quantity,
  };
};
