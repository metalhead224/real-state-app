import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
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
    latitude: 0,
    longitude: 0,
    images: {},
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
    latitude,
    longitude,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    //text/boolean/number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (discontedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed! ");
      return;
    }
    let geoLocation = {};
    let location;
    if (geoLocationEnabled) {
      const response = await fetch(`https://maps.googleapis.com/maps/api/
      geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
      const data = await response.json();
      console.log(data);
      geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) setLoading(false);
      toast.error("please enter a correct address");
      return;
    } else {
      geoLocation.lat = latitude;
      geoLocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is" + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;

              case "running":
                console.log("Upload is running");
                break;

              default:
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formData.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created!");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) return <Spinner />;

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form onSubmit={onSubmit}>
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
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded
            hover:shadow-lg focus:shadow-lg active:shadow-lg transistion duration-150 ease-in-out w-full
            ${
              type === "sale"
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
            ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
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
        {!geoLocationEnabled && (
          <div className="flex gap-4 mb-6">
            <div className="">
              <p>Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 
                bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                focus:bg-white focus:text-gray-700 focus:border-slate-600
                text-center"
              />
            </div>
            <div className="">
              <p>longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 
                bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                focus:bg-white focus:text-gray-700 focus:border-slate-600
                text-center"
              />
            </div>
          </div>
        )}
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
                    ruppees / Month
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
                      ruppees / Month
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
