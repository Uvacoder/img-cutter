import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Cropper from "react-cropper";
import {
  Text,
  Heading,
  Icon,
  Stack,
  Button,
  Box,
  Select,
  Accordion,
} from "@chakra-ui/react";
import { HiUpload, HiDownload } from "react-icons/hi";
import { FiCrop } from "react-icons/fi";
import { BsArrowsMove } from "react-icons/bs";

import ContentWrapper from "../components/ContentWrapper";
import InputFileSelect from "../components/InputFileSelect";
import ActionButton from "../components/ActionButton";
import AccordionSection from "../components/AccordionSection";
import Checkbox from "../components/Checkbox";

import "cropperjs/dist/cropper.css";
import styles from "../styles/Home.module.css";

import { presets } from "../presets.js";

// const defaultImage = "https://picsum.photos/seed/picsum/720/480";

export default function Home() {
  const [image, setImage] = useState();
  // const [cropData, setCropData] = useState();
  const [baseImage, setBaseImage] = useState("");
  const [cropper, setCropper] = useState();

  const [activePreset, setActivePreset] = useState({});

  const [isDragActive, setIsDragActive] = useState(true);
  const [dragArea, setDragArea] = useState({
    width: 0,
    height: 0,
  });

  const cropperRef = useRef(null);
  const onCrop = () => {
    let imageElement =
      cropperRef === null || cropperRef === 0 ? 0 : cropperRef.current;
    let cropper =
      imageElement === null || imageElement === 0 ? 0 : imageElement.cropper;
    setDragArea({
      ...dragArea,
      width: cropper.getCroppedCanvas().width,
      height: cropper.getCroppedCanvas().height,
    });

    setBaseImage(cropper.getCroppedCanvas().toDataURL());
  };

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const zoomIn = () => cropper.zoom(0.1);
  const zoomOut = () => cropper.zoom(-0.1);
  const moveLeft = () => cropper.move(-10, 0);
  const moveRight = () => cropper.move(10, 0);
  const moveUp = () => cropper.move(0, -10);
  const moveDown = () => cropper.move(0, 10);
  const rotateLeft = () => cropper.rotate(-45);
  const rotateRight = () => cropper.rotate(45);
  const swapX = () => cropper.scaleX(-1);
  const swapY = () => cropper.scaleY(-1);
  const reset = () => cropper.reset();

  return (
    <div>
      <Head>
        <title>Cropper: Online image cropper for content creators.</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!image ? (
        <ContentWrapper>
          <div className={styles.heroArea}>
            <h1 className={styles.heroTitle}>
              Image cropper for content creators
            </h1>
            <p className={styles.heroSubTitle}>
              Resolutions and aspect ratios should be the last things you worry
              about.
            </p>

            <div className={styles.heroSelect}>
              <div>
                <p>
                  {" "}
                  Say goodbye to out of positioned, stretched, pixelated, etc
                  images
                </p>
                <p>
                  Stop spending time on trying to figure out the resolutions and
                  aspect ratios
                </p>
              </div>
              <div>
                <InputFileSelect onChange={onChange} />
              </div>
            </div>
            <h1>Three step process</h1>
          </div>
        </ContentWrapper>
      ) : (
        <div className={styles.creatorArea}>
          <div className={styles.presets}>
            <Accordion defaultIndex={[0]} allowToggle>
              {presets.map((site, i) => {
                return (
                  <AccordionSection key={i} title={Object.keys(site)}>
                    {site[Object.keys(site)].map((param, index) => {
                      return (
                        <Checkbox
                          key={index}
                          index={!i && !index}
                          title={param.name}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const getAllCheckboxes =
                                document.querySelectorAll(
                                  "input[type=checkbox]"
                                );
                              console.log(getAllCheckboxes);
                              getAllCheckboxes.forEach((el) => {
                                // console.log(el);
                                // if (el.checked) {
                                //   el.checked = false;
                                // }
                                el.removeAttribute("checked");

                                el.checked = false;
                                el.classList.remove("checked");
                              });
                              setActivePreset({
                                ...activePreset,
                                site: Object.keys(site),
                                name: param.name,
                                description: param.description,
                                height: param.height,
                                width: param.width,
                              });
                              cropper.setAspectRatio(
                                param.width / param.height
                              );
                            } else {
                              setActivePreset({});
                              cropper.setAspectRatio(NaN);
                            }
                          }}
                        />
                      );
                    })}
                  </AccordionSection>
                );
              })}
            </Accordion>
          </div>

          <div
            style={{
              margin: "0 auto",
            }}
          >
            <Cropper
              src={image}
              style={{ height: "480px", width: "100%" }}
              // initialAspectRatio={16 / 9}
              aspectRatio={1600 / 840}
              guides={true}
              preview=".preview"
              crop={onCrop}
              ref={cropperRef}
              disable={false}
              // viewMode={1}
              // minCropBoxHeight={10}
              // minCropBoxWidth={10}
              // background="black"
              // zoom={4}
              // responsive={true}
              // movable={true}
              // autoCropArea={1}
              // checkOrientation={false}
              // crop={() => {
              //   console.log(124);
              // }}
              autoCropArea={1} //0.8 is default
              background={false}
              viewMode={2}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <div className={styles.controls}>
              <Stack direction="row" spacing={4}>
                <Button
                  onClick={() => {
                    cropper.setDragMode("crop");
                    setIsDragActive(true);
                  }}
                  leftIcon={<Icon as={FiCrop} />}
                  colorScheme="orange"
                  variant="solid"
                  isActive={isDragActive}
                >
                  Crop
                </Button>
                <Button
                  onClick={() => {
                    cropper.setDragMode("move");
                    setIsDragActive(false);
                    console.log(cropper);
                  }}
                  leftIcon={<Icon as={BsArrowsMove} />}
                  colorScheme="orange"
                  variant="solid"
                  isActive={!isDragActive}
                >
                  Move
                </Button>

                <ActionButton
                  onClick={zoomIn}
                  icon={BsArrowsMove}
                  color="teal"
                  title="Zoom in"
                />
                <ActionButton
                  onClick={zoomOut}
                  icon={BsArrowsMove}
                  color="teal"
                  title="Zoom out"
                />
                <ActionButton
                  onClick={moveLeft}
                  icon={BsArrowsMove}
                  color="teal"
                  title="Move left"
                />
                <ActionButton
                  onClick={moveRight}
                  icon={BsArrowsMove}
                  color="teal"
                  title="Move right"
                />
                <ActionButton
                  onClick={moveUp}
                  icon={BsArrowsMove}
                  color="teal"
                  title="Move up"
                />
                <ActionButton
                  onClick={moveDown}
                  icon={BsArrowsMove}
                  color="teal"
                  title="Move Down"
                />
              </Stack>
            </div>
          </div>

          <div className={styles.tools}>
            <div className={styles.titleBox}>
              {activePreset.site ? (
                <h1>
                  {activePreset.site} {activePreset.name}
                </h1>
              ) : (
                <h1>Your custom size</h1>
              )}
            </div>

            {activePreset.site ? (
              <p>{activePreset.description}</p>
            ) : (
              <h1>Draw any crop area you want</h1>
            )}

            <div className={styles.titleBox}>
              <h1>Cropped data:</h1>
            </div>

            <div className={styles.croppedInfo}>
              <div>
                <h1 className={styles.croppedRes}>{dragArea.width}</h1>
                <p>Width</p>
              </div>
              <div>
                <h1>X</h1>
              </div>
              <div>
                <h1 className={styles.croppedRes}>{dragArea.height}</h1>
                <p>Height</p>
              </div>
              <div>
                <p>Res.score</p>
                <h1 className={styles.croppedRes}>
                  {Math.round((dragArea.width * 100) / activePreset.width)} %
                </h1>
              </div>
            </div>
            {/* <p>W progress</p>
            <p>H progress</p> */}
            {/* <p>Aspect ratio: {cropper ? cropper.options.aspectRatio : 0}</p> */}

            <div className={styles.titleBox}>
              <h1>Image preview:</h1>
            </div>

            <div
              style={{
                height: "auto",
                width: "100%",
                position: "relative",
                marginBottom: "20px",
              }}
            >
              <div
                className="preview"
                style={{
                  height: "200px",
                  overflow: "hidden",
                }}
              ></div>
            </div>

            <Stack direction="row" spacing={2}>
              <a download="test.jpg" href={baseImage}>
                <Button
                  onClick={() => {
                    cropper.getCroppedCanvas({
                      width: "90px",
                      height: "90px",
                    });
                  }}
                  rightIcon={<Icon as={HiDownload} />}
                  colorScheme="teal"
                  variant="solid"
                  w={150}
                >
                  Download
                </Button>
              </a>

              <Select
                placeholder=".PNG"
                w={24}
                onChange={() => {
                  console.log("Changed");
                }}
              >
                <option value="option2">.JPG</option>
              </Select>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}
