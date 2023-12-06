import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dto/edit-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { Category } from './entities/category.entity';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import {
  SearchRestaurantOutput,
  SearchRestaurantInput,
} from './dto/search-restaurant.dto';
import { Dish } from './entities/dish.entity';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';
import { MyRestaurantsOutput } from './dto/my-restaurants.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dto/my-restaurant.dto';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() user: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(user, createRestaurantInput);
  }

  @Query(() => MyRestaurantsOutput)
  @Role(['Owner'])
  myRestaurants(@AuthUser() user: User): Promise<MyRestaurantsOutput> {
    return this.restaurantService.myRestaurants(user);
  }

  @Query(() => MyRestaurantOutput)
  @Role(['Owner'])
  myRestaurant(
    @AuthUser() user: User,
    @Args('input') myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    return this.restaurantService.myRestaurant(user, myRestaurantInput);
  }

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() user: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(user, editRestaurantInput);
  }

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() user: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(user, deleteRestaurantInput);
  }

  @Query(() => RestaurantsOutput)
  restaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }

  @Query(() => RestaurantOutput)
  restaurant(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: RestaurantService) {}

  @ResolveField(() => Number)
  restaurantCount(@Parent() category: Category): Promise<number> {
    console.log(category);
    return this.categoryService.countRestaurants(category);
  }

  @Query(() => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.categoryService.allCategories();
  }

  @Query(() => CategoryOutput)
  findCategoryBySlug(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.categoryService.findCategoryBySlug(categoryInput);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly dishService: RestaurantService) {}

  @Mutation(() => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @AuthUser() user: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.dishService.createDish(user, createDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  editDish(
    @AuthUser() user: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.dishService.editDish(user, editDishInput);
  }

  @Mutation(() => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @AuthUser() user: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.dishService.deleteDish(user, deleteDishInput);
  }
}
