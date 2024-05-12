"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/form.css";
import DND from "@/public/drag-and-drop.png";
import xLogo from "@/public/twitter.png";
import telegramLogo from "@/public/telegram.png";
import webLogo from "@/public/world-wide-web.png";
import Image from "next/image";
import * as Collapsible from '@radix-ui/react-collapsible'
import { RowSpacingIcon, Cross2Icon } from '@radix-ui/react-icons';

type SocialLinks = {
  twitter: string;
  telegram: string;
  website: string;
};

type MyFile = File & { preview: string };

interface FormState {
  name: string;
  ticker: string;
  description: string;
  image: MyFile[];
  socialLinks: SocialLinks;
}

const Form = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    ticker: "",
    description: "",
    image: [],
    socialLinks: {
      twitter: "",
      telegram: "",
      website: "",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLinks,setShowLinks] = useState<boolean>(false)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setForm({
        ...form,
        image: acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      });
    },
    maxFiles: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name in form.socialLinks) {
      setForm({
        ...form,
        socialLinks: {
          ...form.socialLinks,
          [name]: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const validateForm = (form: FormState) => {
    let errors: { [key: string]: string } = {};

    if (!form.name) {
      errors.name = "Name is required.";
    } else if (/\d/.test(form.name)) {
      errors.name = "Name cannot contain numbers.";
    }

    if (!form.ticker) {
      errors.ticker = "Ticker is required.";
    }

    if (!form.description) {
      errors.description = "Description is required.";
    } else if (form.description.length > 200) {
      errors.description = "Description cannot be more than 200 characters.";
    }

    if (!form.image) {
      errors.image = "Image is required.";
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors = validateForm(form);

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div>
        <label htmlFor="name" className="block text-[#48d7ff]">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Your Username"
          className="w-full p-2 border border-gray-300 rounded bg-[#050e1a9e] text-white"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="name" className="block text-[#48d7ff]">
          Ticker
        </label>
        <input
          type="text"
          name="ticker"
          value={form.ticker}
          onChange={handleChange}
          placeholder="Specify Ticker"
          className="w-full p-2 border border-gray-300 rounded bg-[#050e1a9e] text-white"
        />
        {errors.ticker && (
          <p className="text-red-500 text-xs mt-1">{errors.ticker}</p>
        )}
      </div>
      <div>
        <label htmlFor="name" className="block text-[#48d7ff]">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Tell us more about your coin"
          className="w-full p-2 border border-gray-300 rounded bg-[#050e1a9e] text-white"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>
      <div
        {...getRootProps()}
        className="flex relative flex-col items-center justify-center p-5 border-dashed bg-[#4b6a7d7d] border border-gray-300 text-gray-400 rounded"
      >
        <input {...getInputProps()} />
        {form.image[0] ? (
          <div className=" absolute size-full group hover:bg-slate-400/5">
            <p className="ml-2 on hidden group-hover:block text-slate-400  text-center">
              {isDragActive
                ? "Drop the files here ..."
                : "Drag 'n' drop Image, or click to select Image"}
            </p>
          </div>
        ) : (
          <>
            <Image src={DND} alt="drag and drop" className=" size-[4rem]" />
            <p className="ml-2">
              {isDragActive
                ? "Drop the files here ..."
                : "Drag 'n' drop Image, or click to select Image"}
            </p>
          </>
        )}
        {form.image[0] && (
          <Image
            src={form.image[0].preview}
            alt="Selected"
            width={500}
            height={300}
            className=" max-w-full max-h-[300px]"
          />
        )}
      </div>
      {errors.image && (
        <p className="text-red-500 text-xs mt-1">{errors.image}</p>
      )}
    <Collapsible.Root open={showLinks} onOpenChange={setShowLinks}>

    <div className=" flex items-center justify-between mb-5" >
        <span className="text-violet11 text-[15px] leading-[25px] text-[#48d7ff]" >
          Add social links
        </span>
        <Collapsible.Trigger asChild>
          <button className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet3 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black">
          {showLinks ? <Cross2Icon /> : <RowSpacingIcon />}
          </button>
        </Collapsible.Trigger>
      </div>

  <Collapsible.Content>
    <div className=" flex gap-5 items-center">
      <Image src={xLogo} alt="X" className=" size-6 " />
      <input
        type="text"
        name="twitter"
        value={form.socialLinks.twitter}
        onChange={handleChange}
        placeholder="Link X(Twitter)"
        className="w-full p-2 border border-gray-300 rounded bg-[#050e1a9e] text-gray-400 "
      />
    </div>
    <div className=" flex gap-5 items-center">
      <Image src={telegramLogo} alt="telegram" className=" size-6 " />
      <input
        type="text"
        name="telegram"
        value={form.socialLinks.telegram}
        onChange={handleChange}
        placeholder="Link Telegram"
        className="w-full p-2 border border-gray-300 rounded bg-[#050e1a9e] text-gray-400 -z"
      />
    </div>
    <div className=" flex gap-5 items-center">
      <Image src={webLogo} alt="web" className=" size-6 " />
      <input
        type="text"
        name="website"
        value={form.socialLinks.website}
        onChange={handleChange}
        placeholder="Link Website"
        className="w-full p-2 border border-gray-300 rounded bg-[#050e1a9e] text-gray-400 "
      />
    </div>
  </Collapsible.Content>
</Collapsible.Root>
      <button
        type="submit"
        className="btn p-2 hover:text-[#5ea9ff] hover:bg-[#5db6ff42] text-white rounded w-full md:w-1/2 mx-auto block"
      >
        Create Coin
      </button>
    </form>
  );
};

export default Form;
