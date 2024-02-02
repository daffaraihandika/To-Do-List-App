import { Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { React, useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, Flex, Checkbox, Text } from '@chakra-ui/react'
import ReactTags from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import axios from "axios";
import { Spinner } from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
} from '@chakra-ui/react'

export const ModalAddTag = ({ isOpen, onCloseModal, editTagId }) => {
  const [tagName, setTagName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState('');

  const userId = localStorage.getItem("userId")
  const isEditModal = Boolean(editTagId);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  useEffect(() => {
    // Fetch task data for editing if in edit mode
    if (isEditModal) {
      getDetailTag();
    }
  }, [isEditModal]);

  const getDetailTag = async (e) => {
    try {
      const response = await axios.get(`http://localhost:5000/tag/${userId}/${editTagId}`);
      console.log("Detail Tags: ", response.data.data)
      setTagName(response.data.data.namaTag)
      setDescription(response.data.data.deskripsi)
    } catch (error) {
      console.log(error)
    }
  }

  const loaderSuccess = () => {
    setIsError(false);
  
      setTimeout(() => {
        setLoading(false);
  
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onCloseModal();
          window.location.reload();
        }, 500);
      }, 500);
  }

  const loaderFailed = () => {
    setTimeout(() => {
      setIsError(true);
      setLoading(false);
    }, 500);
  }

  const handleAddTag = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/tag', {
        namaTag: tagName,
        deskripsi: description,
        userId: userId ? parseInt(userId, 10) : undefined
      });

      setMsg(response.data.msg)
      loaderSuccess();
    } catch (error) {
      setMsg(error.response.data.msg)
      loaderFailed();
    }
  };

  const handleEditTag = async (taskId) => {
    try {
      setLoading(true);
      const response = await axios.patch(`http://localhost:5000/tag/${userId}/${taskId}`, {
        namaTag: tagName,
        deskripsi: description,
        userId: userId ? parseInt(userId, 10) : undefined
      });
  
      setMsg(response.data.msg);
      loaderSuccess();
    } catch (error) {
      setMsg(error.response.data.msg);
      loaderFailed()
    }
  }

  const handleModalClose = () => {
    setIsError(false);
    onCloseModal();
  };

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
        <ModalHeader>{isEditModal ? 'Edit Tag' : 'Create New Tag'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Tag Name</FormLabel>
            <Input ref={initialRef} placeholder='Task name' required onChange={(e) => setTagName(e.target.value)} value={tagName}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input placeholder='Description (optional)' onChange={(e) => setDescription(e.target.value)} value={description}/>
          </FormControl>

          {isError &&
            <Alert status='error' sx={{ mt: '24px', mb: '0' }}>
              <AlertIcon />
              {msg}
            </Alert>
          }
          {isSuccess &&
            <Alert status='success' sx={{ mt: '24px', mb: '0' }}>
              <AlertIcon />
              {msg}
            </Alert>
          }
        </ModalBody>

        <ModalFooter sx={{ pt: '0' }}>
            {loading ? ( // Tampilkan Spinner jika sedang dalam proses loading
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='lg'
              />
            ) : (
              <>
                <Button colorScheme='blue' mr={3} onClick={() => isEditModal ? handleEditTag(editTagId) : handleAddTag()}>
                  {isEditModal ? 'Save Changes' : 'Save'}
                </Button>
                <Button onClick={handleModalClose}>Cancel</Button>
              </>
            )}
        </ModalFooter>
        
      </ModalContent>
 
    </Modal>
    
  );
};
