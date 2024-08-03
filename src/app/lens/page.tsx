"use client";
import { CameraIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";

interface ObjectResult {
  Obj: string;
}

interface SearchResult {
  link: string;
}

interface APIResponse {
  Objects: ObjectResult[];
  "Search-Results": SearchResult[];
}

const exampleResults = [
  {
    Objects: [
      { Obj: "Cat" },
      { Obj: "Car" },
      { Obj: "Man" },
      { Obj: "Gun" },
      { Obj: "Machine" },
      { Obj: "Chair" },
    ],
    "Search-Results": [
      {
        link: "http://example.com/link1",
      },
      {
        link: "http://example.com/link2",
      },
      {
        link: "http://example.com/link3",
      },
      {
        link: "http://example.com/link4",
      },
    ],
  },
];

const Lens: React.FC = () => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [results, setResults] = useState<APIResponse[]>([]);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"objects" | "links">("objects");
  const webcamRef = useRef<Webcam>(null);

  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc ?? undefined);
      setCameraVisible(false);
    }
  };

  const handleRetakePhoto = () => {
    setImage(undefined);
    setCameraVisible(true);
  };

  const handleViewResults = async () => { 
    if (!image) return;

    setLoading(true);
    setShowResults(true);

    try {
      const response = await fetch("/api/trpc/post/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await response.json()) as { results: APIResponse[] };

      if (typeof data.results === 'object' && Array.isArray(data.results)) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Error:", error);
      setResults(exampleResults); // Fallback example data for demonstration
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-x-hidden dark:bg-background md:px-0 px-10">
      {!cameraVisible && !image && (
        <>
          <div className="md:mb-8 md:mt-0 mt-40 text-center">
            <h1 className="m-4 md:mb-4 text-4xl font-bold">Smart Lens</h1>
            <p className="text-lg text-primary">
              Capture and identify objects effortlessly.
            </p>
          </div>
          <div className="mb-12 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <Image
                src="/favicon.ico"
                alt="Feature 1"
                className="mx-auto mb-4"
                width={150}
                height={150}
              />
              <h3 className="text-xl font-semibold">Feature 1</h3>
              <p className="text-primary">Capture photos with ease.</p>
            </div>
            <div>
              <Image
                src="/favicon.ico"
                alt="Feature 2"
                className="mx-auto mb-4"
                width={150}
                height={150}
              />
              <h3 className="text-xl font-semibold">Feature 2</h3>
              <p className="text-primary">Identify objects instantly.</p>
            </div>
            <div>
              <Image
                src="/favicon.ico"
                alt="Feature 3"
                className="mx-auto mb-4"
                width={150}
                height={150}
              />
              <h3 className="text-xl font-semibold">Feature 3</h3>
              <p className="text-primary">Get accurate results quickly.</p>
            </div>
          </div>
          <Button onClick={() => setCameraVisible(true)} className="gap-2">
            <CameraIcon />
            <p className="hidden md:block">Open Camera</p>
          </Button>
        </>
      )}

      {cameraVisible && (
        <div className="relative flex h-full w-full flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="absolute left-0 top-0 h-screen w-screen border-primary"
            videoConstraints={{ facingMode: "user" }}
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4">
            <Button onClick={handleTakePhoto}>Capture</Button>
          </div>
        </div>
      )}

      {image && !loading && !showResults && (
        <div className="md:mt-8 flex flex-col items-center md:h-[80dvh] h-[30dvh] md:mb-4  max-w-6xl my-10">
          <div className="md:h-[80dvh] h-[20dvh] mb-4  md:max-w-6xl max-w-xs w-screen relative">

          <Image
            src={image}
            alt="Captured preview"
            className=" border-2 border-primary "
            fill
          />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleRetakePhoto}>Retake Photo</Button>
            <Button onClick={handleViewResults}>View Results</Button>
          </div>
        </div>
      )}

      {showResults && (
        <div className="relative flex h-full w-full flex-col md:flex-row m-10">
          <motion.div
            className="flex flex-col items-center justify-center bg-transparent md:w-1/2"
            initial={{ x: "0%", opacity: "0%" }}
            animate={{ x: "0%", opacity: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:h-[80dvh] h-[20dvh] mb-4  md:max-w-4xl max-w-xs w-screen relative"> 

            <Image
              src={image!}
              alt="Captured preview"
              className="border-2"
              fill
            />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center overflow-auto border-primary p-4 md:w-1/2"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 w-full rounded-lg border-2 bg-primary p-2 text-center text-2xl font-semibold text-primary-foreground">
              Results
            </h2>

            <Tabs
              defaultValue="account"
              className="mb-4 flex w-full flex-col gap-4 p-4"
            >
              <TabsList className="bg-background">
                <TabsTrigger
                  className="bg-primary text-primary-foreground"
                  value="account"
                  onClick={() => setActiveTab("objects")}
                >
                  Objects
                </TabsTrigger>
                <TabsTrigger
                  className="bg-primary text-primary-foreground"
                  value="password"
                  onClick={() => setActiveTab("links")}
                >
                  Links
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                {loading && <p>Loading...</p>}
                {!loading && activeTab === "objects" && (
                  <>
                    <p className="text-4xl text-primary">Identified Objects:</p>
                    <ul className="my-10 list-decimal pl-4">
                      {results[0]?.Objects.map((item, index) => (
                        <li key={index}>{item.Obj}</li>
                      ))}
                    </ul>
                  </>
                )}
              </TabsContent>
              <TabsContent value="password">
                {!loading && activeTab === "objects" && (
                  <>
                    <p className="text-4xl text-primary">Identified Objects:</p>
                    <ul className="my-10 list-decimal pl-4">
                      {results[0]?.Objects.map((item, index) => (
                        <li key={index}>{item.Obj}</li>
                      ))}
                    </ul>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Lens;
