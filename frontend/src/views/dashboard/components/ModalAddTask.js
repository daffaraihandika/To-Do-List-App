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

export const ModalAddTask = ({ isOpen, onCloseModal, editTaskId }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [dateline, setDateline] = useState(new Date());
  const [tagsInput, setTagsInput] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState('');

  const userId = localStorage.getItem("userId")
  const isEditModal = Boolean(editTaskId);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  useEffect(() => {
    getAllTags()
  }, [])

  useEffect(() => {
    // Fetch task data for editing if in edit mode
    if (isEditModal) {
      getDetailTasks();
    }
  }, [isEditModal]);

  const getAllTags = async (e) => {
    try {
      const response = await axios.get(`http://localhost:5000/tags/${userId}`);
      const tagNames = response.data.data.map((tag) => tag.namaTag);
      setSuggestedTags(tagNames);
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailTasks = async (e) => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${userId}/${editTaskId}`);
      console.log("Detail Tasks: ", response.data.data)
      setTaskName(response.data.data.namaTask)
      setDescription(response.data.data.deskripsi)
      setPriority(response.data.data.prioritas)
      setStatus(response.data.data.isCompleted)
      setDateline(new Date(response.data.data.dateLine));
      setTagsInput(response.data.data.tags.map(tag => tag.namaTag));
      setStatus(response.data.data.isCompleted)
      // setSuggestedTags(response.data.data.tags.map(tag => tag.namaTag));
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

  const handleAddTask = async () => {
    try {
      setLoading(true);
      const tagsData = tagsInput.map((tagName) => ({ namaTag: tagName }));
      const response = await axios.post('http://localhost:5000/task', {
        userId: userId ? parseInt(userId, 10) : undefined,
        namaTask: taskName,
        deskripsi: description,
        prioritas: priority,
        dateLine: dateline.toISOString(),
        tags: tagsData,
      });
  
      setMsg(response.data.msg);
      loaderSuccess();
    } catch (error) {
      setMsg(error.response.data.msg);
      loaderFailed()
    }
  };
  

  const handleEditTask = async (taskId) => {
    try {
      setLoading(true);
      const tagsData = tagsInput.map((tagName) => ({ namaTag: tagName }));
      const response = await axios.patch(`http://localhost:5000/task/${userId}/${taskId}`, {
        userId: userId ? parseInt(userId, 10) : undefined,
        namaTask: taskName,
        deskripsi: description,
        prioritas: priority,
        dateLine: dateline.toISOString(),
        tags: tagsData,
        isCompleted: status === 'true'
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
    // Reset the form fields to their initial values
    setTaskName('');
    setDescription('');
    setPriority('');
    setDateline(new Date());
    setTagsInput([]);
  };

  const handleCheckboxChange = (tag) => {
    const newTagsInput = [...tagsInput];
    if (newTagsInput.includes(tag)) {
      // Remove tag if already present
      newTagsInput.splice(newTagsInput.indexOf(tag), 1);
    } else {
      // Add tag if not present
      newTagsInput.push(tag);
    }
    setTagsInput(newTagsInput);
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={handleModalClose}
      closeOnOverlayClick={false}
      size='xl'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditModal ? 'Edit Task' : 'Create New Task'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Task Name</FormLabel>
            <Input ref={initialRef} placeholder='Task name' required onChange={(e) => setTaskName(e.target.value)} value={taskName}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input placeholder='Description (optional)' onChange={(e) => setDescription(e.target.value)} value={description}/>
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
              <Select placeholder='Select option' onChange={(e) => setPriority(e.target.value)} value={priority}>
                <option value='Rendah'>Rendah</option>
                <option value='Sedang'>Sedang</option>
                <option value='Tinggi'>Tinggi</option>
              </Select>
            </FormControl>
          </Flex>

          {/* Edit mode ganti status */}
          <FormControl mt={4} display={isEditModal && status ? 'block' : 'none'}>
            <FormLabel>Status</FormLabel>
            <Select onChange={(e) => setStatus(e.target.value)} value={status}>
              <option value='true'>Complete</option>
              <option value='false'>Incomplete</option>
            </Select>
          </FormControl>
          {/* Edit mode ganti status */}

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
              addKeys={[9, 13]} // Tab, Enter
              suggestions={suggestedTags}
            />
            {suggestedTags.map((tag, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                isChecked={tagsInput.includes(tag)}
                colorScheme='brandScheme'
                me='10px'
                onChange={() => handleCheckboxChange(tag)}
              />
              <Text color='black' fontSize='sm' fontWeight='700'>
                {tag}
              </Text>
            </div>
          ))}
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
                <Button colorScheme='blue' mr={3} onClick={() => isEditModal ? handleEditTask(editTaskId) : handleAddTask()}>
                  {isEditModal ? 'Save Changes' : 'Save'}
                </Button>
                <Button onClick={onCloseModal}>Cancel</Button>
              </>
            )}
        </ModalFooter>
        
      </ModalContent>
 
    </Modal>
    
  );
};
