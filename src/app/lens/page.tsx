"use client";
import { Camera, CameraIcon, ReceiptPoundSterling, RefreshCcwDot, RefreshCcwIcon } from "lucide-react";
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
  Objects?: ObjectResult[]; // Optional
  SearchResults?: SearchResult[]; // Optional
}

const exampleResults: APIResponse[] = [
  {
    Objects: [
      { Obj: "Cat" },
      { Obj: "Car" },
      { Obj: "Man" },
      { Obj: "Gun" },
      { Obj: "Machine" },
      { Obj: "Chair" },
    ],
  },
  {
    SearchResults: [
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
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
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

      if (typeof data.results === "object" && Array.isArray(data.results)) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Error:", error);
      setResults(exampleResults); // Fallback example data for demonstration
    } finally {
      setLoading(false);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) =>
      prevMode === "user" ? "environment" : "user"
    );
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-x-hidden px-10 dark:bg-background md:px-0">
      {!cameraVisible && !image && (
        <>
          <div className="mt-40 text-center md:mb-8 md:mt-0">
            <h1 className="m-4 text-4xl font-bold md:mb-4">Smart Lens</h1>
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
            videoConstraints={{ facingMode }}
          />
          <div className="absolute bottom-0  flex justify-between space-x-2 p-4 w-1/2 ">
            <Button onClick={handleTakePhoto}><Camera></Camera></Button>
            <Button onClick={toggleFacingMode} className="ml-auto">
              <RefreshCcwIcon />
            </Button>
          </div>
        </div>
      )}

      {image && !loading && !showResults && (
        <div className="my-10 flex h-[30dvh] max-w-6xl flex-col items-center md:mb-4 md:mt-8 md:h-[80dvh]">
          <div className="relative mb-4 h-[20dvh] w-screen max-w-xs md:h-[80dvh] md:max-w-6xl">
            <Image
              src={image}
              alt="Captured preview"
              className="border-2 border-primary"
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
        <div className="relative m-10 flex h-full w-full flex-col md:flex-row">
          <motion.div
            className="flex flex-col items-center justify-center bg-transparent md:w-1/2"
            initial={{ x: "0%", opacity: "0%" }}
            animate={{ x: "0%", opacity: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-4 h-[20dvh] w-screen max-w-xs md:h-[80dvh] md:max-w-4xl">
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
            <div className="mb-4 w-full rounded-lg border-2 bg-primary p-2 text-center text-2xl font-semibold text-primary-foreground flex justify-between px-5 items-center">
              
            <Button variant={"secondary"}  className="space-x-2 opacity-0 hover:cursor-default hidden md:block">
                
                <RefreshCcwDot/>
                <p>

                Reset
                </p>
              </Button>
              <h2>
              Results
              </h2>
              <a href={"/lens"} >
              <Button variant={"secondary"} className="space-x-2">
                
                <RefreshCcwDot/>
                <p className="hidden md:block">

                Reset
                </p>
              </Button>
              </a>
             
            </div>

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
                      {results[0]?.Objects?.map((item, index) => (
                        <li key={index}>{item.Obj}</li>
                      ))}
                    </ul>
                  </>
                )}
              </TabsContent>
              <TabsContent value="password">
                {!loading && activeTab === "links" && (
                  <>
                    <p className="text-4xl text-primary">Results:</p>
                    <ul className="my-10 list-disc text-blue-500 pl-4">
                      {results
                        .filter((result) => result.SearchResults)
                        .flatMap((result) => result.SearchResults!)
                        .map((item, index) => (
                          <li key={index}>
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.link}
                            </Link>
                          </li>
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
