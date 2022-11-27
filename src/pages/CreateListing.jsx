import React, { useState } from "react";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discontedPrice: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discontedPrice,
  } = formData;

  function onChange() {}

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex gap-4">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700
          bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
          focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="flex space-x-6 gap-3 mb-6">
          <div>
            <p>Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white 
              border border-gray-300 rounded transition duration-150 ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p>Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white 
              border border-gray-300 rounded transition duration-150 ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex gap-4">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${
              parking === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700
          bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
          focus:bg-white focus:border-slate-600"
        />
        <p className="text-lg mt-6 font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700
          bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
          focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            no
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full space-x-6 items-center">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div>
                  <p
                    className="text-md w-full 
                whitespace-nowrap"
                  >
                    $ / Month
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full space-x-6 items-center">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discontedPrice}
                  onChange={onChange}
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div>
                    <p
                      className="text-md w-full 
                whitespace-nowrap"
                    >
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">The first image will be cover (max 6)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700
            bg-white border border-gray-300 rounded transition duration-150 ease-in-out
            focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3
        bg-blue-600 text-white font-medium text-sm uppercase rounded
        shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
        active:bg-blue-800 active:shadow:lg transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
