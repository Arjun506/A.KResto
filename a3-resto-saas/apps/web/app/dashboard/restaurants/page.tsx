'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type { Restaurant } from '@/src/types/restaurant.types';

import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '@/services/restaurant.service';


export default function RestaurantsPage() {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [loading, setLoading] =
    useState(true);


  const [name, setName] =
    useState('');

  const [slug, setSlug] =
    useState('');

  const [address, setAddress] =
    useState('');

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchRestaurants();
    })();
  }, [fetchRestaurants]);


  const handleCreateRestaurant =

    async () => {
      try {
        await createRestaurant({
          name,
          slug,
          address,
        });

        setName('');
        setSlug('');
        setAddress('');

        void fetchRestaurants();

        alert(
          'Restaurant created successfully'
        );
      } catch (error) {
        console.error(error);

        alert(
          'Failed to create restaurant'
        );
      }
    };

  const handleUpdateRestaurant =
    async () => {
      try {
        if (!editingId) return;

        await updateRestaurant(
          editingId,
          {
            name,
            slug,
            address,
          }
        );

        setEditingId(null);

        setName('');
        setSlug('');
        setAddress('');

        void fetchRestaurants();

        alert(
          'Restaurant updated successfully'
        );
      } catch (error) {
        console.error(error);

        alert(
          'Failed to update restaurant'
        );
      }
    };

  const handleDeleteRestaurant =
    async (id: string) => {
      try {
        await deleteRestaurant(id);

        void fetchRestaurants();

        alert(
          'Restaurant deleted successfully'
        );
      } catch (error) {
        console.error(error);

        alert(
          'Failed to delete restaurant'
        );
      }
    };

  if (loading) {
    return (
      <div>
        Loading restaurants...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Restaurants
        </h1>

        <p className="text-gray-500 mt-2">
          Real PostgreSQL restaurant data
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          {editingId
            ? 'Edit Restaurant'
            : 'Add Restaurant'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border rounded-2xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            className="border rounded-2xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            className="border rounded-2xl px-4 py-3"
          />

        </div>

        <button
          onClick={
            editingId
              ? handleUpdateRestaurant
              : handleCreateRestaurant
          }
          className="mt-5 bg-black text-white px-6 py-3 rounded-2xl"
        >
          {editingId
            ? 'Update Restaurant'
            : 'Create Restaurant'}
        </button>

      </div>

      <div className="bg-white rounded-3xl shadow p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b text-left">

              <th className="py-4">
                Name
              </th>

              <th>Slug</th>

              <th>Address</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {restaurants.map(
              (restaurant) => (
                <tr
                  key={restaurant.id}
                  className="border-b"
                >

                  <td className="py-4 font-medium">
                    {restaurant.name}
                  </td>

                  <td>
                    {restaurant.slug}
                  </td>

                  <td>
                    {restaurant.address}
                  </td>

                  <td className="py-4">

                    <div className="flex gap-3">

                      <button
                        onClick={() => {
                          setEditingId(
                            restaurant.id
                          );

                          setName(
                            restaurant.name
                          );

                          setSlug(
                            restaurant.slug
                          );

                          setAddress(
                            restaurant.address ?? ''
                          );
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteRestaurant(
                            restaurant.id
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
