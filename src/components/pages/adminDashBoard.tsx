"use client";

import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import usePersistStore from "@/hooks/usePersistStore";
import { Session, useHomePageStore } from "@/lib/features";
import type { ArtistFormDataType } from "@/hooks";
import {
  Card,
  CardBody,
  CardHeader,
  Listbox,
  ListboxItem,
  ListboxSection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import AllArtistsTab from "../adminTabs/allArtistsTab";
import AddNewArtistTab from "../adminTabs/addNewArtistTab";
import AddNewPhotoTab, { PhotoFormData } from "../adminTabs/addNewPhotoTab";
import AllPhotosTab from "../adminTabs/allPhotosTab";
import styles from "./dashboard.module.css";

type Props = {
  session: Session;
};

export default function AdminDashBoard({ session }: Props) {
  const store = usePersistStore(useHomePageStore, (state) => state);
  const userId = session.user.id;
  const [selectedKeys, setSelectedKeys] = useState<Set<number>>(new Set([0]));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (store && Object.keys(store.artists).length === 0) {
      store?.loadAllData();
    }
  }, [store]);

  const submitUpdateArtist = async (
    artistId: string,
    formData: ArtistFormDataType,
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    // We don't want the page to refresh
    e.preventDefault();

    await store?.updateArtist(artistId, formData);
  };

  const submitAddNewArtist = async (
    formData: ArtistFormDataType,
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    // We don't want the page to refresh
    e.preventDefault();

    await store?.createArtist(userId, formData).finally(() => {
      setSelectedKeys(new Set([1]));
    });
  };

  const submitAddNewPhoto = async (
    photoFormData: PhotoFormData,
    e: SyntheticEvent
  ): Promise<void> => {
    // We don't want the page to refresh    
    e.preventDefault();

    await store?.createPhoto(userId, photoFormData).finally(() => {
      setSelectedKeys(new Set([5]));
    });
  };

  const submitDeleteArtist = async (artistId: string): Promise<void> => {
    await store?.deleteArtist(artistId, store.artists).finally(() => {
      setSelectedKeys(new Set([1]));
    });
  };

  const submitDeletePhoto = async (photoId: string): Promise<void> => {
    await store?.deletePhoto(photoId);
  };

  if (!store) {
    return null;
  }

  return (
    <div className="p-2 text-white">
      <div className="flex gap-x-4 h-[calc(100vh-128px)] pb-4">
        <section className={`${styles.bgGradient} basis-1/4 rounded-md`}>
          <Listbox
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(key: any) => setSelectedKeys(key)}
          >
            <ListboxSection showDivider>
              <ListboxItem key={0}>Overview</ListboxItem>
            </ListboxSection>

            <ListboxSection title="Manage Artists" showDivider>
              <ListboxItem key={1}>All artists</ListboxItem>
              <ListboxItem key={2}>Add artist</ListboxItem>
            </ListboxSection>

            {/* <ListboxSection title="Manage Users" showDivider>
              <ListboxItem key={3}>All users</ListboxItem>
              <ListboxItem key={4}>Add user</ListboxItem>
            </ListboxSection> */}

            <ListboxSection title="Manage Photos" showDivider>
              <ListboxItem key={5}>All photos</ListboxItem>
              <ListboxItem key={6}>Add photo</ListboxItem>
            </ListboxSection>

            {/* <ListboxSection title="Manange Promotions" showDivider>
              <ListboxItem key={7}>All promotions</ListboxItem>
              <ListboxItem key={8}>Add promotion</ListboxItem>
            </ListboxSection> */}
{/* 
            <ListboxSection title="Manange Open Hours" showDivider>
              <ListboxItem key={9}>Show open hours</ListboxItem>
              <ListboxItem key={10}>Edit open hours</ListboxItem>
            </ListboxSection> */}
          </Listbox>
        </section>

        <section className="grow basis-full overflow-auto">
          {Number(selectedValue) === 0 && (
            <Card>
              <CardHeader>Overview</CardHeader>
              <CardBody>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Rows by category</TableColumn>
                    <TableColumn>Total</TableColumn>
                  </TableHeader>

                  <TableBody>
                    <TableRow key="1">
                      <TableCell>
                        {store.artists.count > 1 ? "Artists" : "Artist"}
                      </TableCell>
                      <TableCell>{store.artists.count}</TableCell>
                    </TableRow>

                    <TableRow key="2">
                      <TableCell>
                        {store.photos.count > 1 ? "Photos" : "Photo"}
                      </TableCell>
                      <TableCell>{store.photos.count}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )}

          {Number(selectedValue) === 1 && (
            <AllArtistsTab
              artists={store.artists}
              submit={submitUpdateArtist}
              submitDelete={submitDeleteArtist}
            />
          )}

          {Number(selectedValue) === 2 && (
            <AddNewArtistTab
              submit={submitAddNewArtist}
              slectedKeyHandler={setSelectedKeys}
            />
          )}

          {Number(selectedValue) === 5 && (
            <AllPhotosTab
              photos={store.photos}
              submitDelete={submitDeletePhoto}
            />
          )}
          {Number(selectedValue) === 6 && (
            <AddNewPhotoTab
              artists={store.artists}
              submit={submitAddNewPhoto}
              cancelHandler={(e: number) => setSelectedKeys(new Set([e]))}
            />
          )}
        </section>
      </div>
    </div>
  );
}
