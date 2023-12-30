// ModalAddTask.js
import { Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { React, useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, Flex, Checkbox, Text } from '@chakra-ui/react'
import ReactTags from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import axios from "axios";

export const ModalAddTask = ({ isOpen, onCloseModal }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dateline, setDateline] = useState(new Date());
  const [tagsInput, setTagsInput] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);

  const userId = localStorage.getItem("userId")
  

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  useEffect(() => {
    getAllTags()
  }, [])

  const getAllTags = async (e) => {
    try {
      const response = await axios.get(`http://localhost:5000/tags/${userId}`);
      const tagNames = response.data.data.map((tag) => tag.namaTag);
      setSuggestedTags(tagNames);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const tagsData = tagsInput.map(tagName => ({ namaTag: tagName }));
      const response = await axios.post('http://localhost:5000/task', {
        userId: userId ? parseInt(userId, 10) : undefined, 
        namaTask: taskName, 
        deskripsi: description, 
        prioritas: priority, 
        dateLine: dateline.toISOString(), 
        tags: tagsData
      });

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnOverlayClick={false}
      size='xl'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* <FormControl>
            <FormLabel>Id User</FormLabel>
            <Input placeholder='Id User' required onChange={(e) => setUserId(parseInt(e.target.value, 10) || undefined)}/>
          </FormControl> */}
          
          <FormControl>
            <FormLabel>Task Name</FormLabel>
            <Input ref={initialRef} placeholder='Task name' required onChange={(e) => setTaskName(e.target.value)}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input placeholder='Description (optional)' onChange={(e) => setDescription(e.target.value)}/>
          </FormControl>

          <Flex mt={4} justify="space-between">
            <FormControl flexBasis="48%">
              <FormLabel>Deadline</FormLabel>
              <DatePicker 
                selected={dateline} 
                onChange={(date) => setDateline(date)} 
              />
            </FormControl>

            <FormControl flexBasis="48%">
              <FormLabel>Priority</FormLabel>
              <Select placeholder='Select option' onChange={(e) => setPriority(e.target.value)}>
                <option value='Rendah'>Rendah</option>
                <option value='Sedang'>Sedang</option>
                <option value='Tinggi'>Tinggi</option>
              </Select>
            </FormControl>
          </Flex>

          <FormControl mt={4}>
            <FormLabel>Tags</FormLabel>
            <ReactTags
              inputProps={{
                placeholder: 'Add tags',
              }}
              value={tagsInput}
              onChange={(tags) => setTagsInput(tags)}
              addOnBlur
              onlyUnique
              addKeys={[9, 13]} // Tab, Enter, Space
              suggestions={suggestedTags}
            />
            {suggestedTags.map((tag, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                defaultChecked={tagsInput.includes(tag)}
                colorScheme='brandScheme'
                me='10px'
                onChange={() => {
                  const newTagsInput = [...tagsInput];
                  if (newTagsInput.includes(tag)) {
                    // Remove tag if already present
                    newTagsInput.splice(newTagsInput.indexOf(tag), 1);
                  } else {
                    // Add tag if not present
                    newTagsInput.push(tag);
                  }
                  setTagsInput(newTagsInput);
                }}
              />
              <Text color='black' fontSize='sm' fontWeight='700'>
                {tag}
              </Text>
            </div>
          ))}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleAddTask}>
            Save
          </Button>
          <Button onClick={onCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
