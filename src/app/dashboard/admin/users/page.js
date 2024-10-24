import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const AdminUsers = () => {
    return (
        <Box className="mx-2 md:mx-3 lg:mx-0">
            <h3 className="text-xl font-lora font-semibold text-gray-900 mt-2">User management</h3>
            <p className="text-sm font-lora font-medium text-gray-700 mt-2">Manage your team members and their account permissions here.</p>
            <Box className="flex justify-between items-center md:mr-2 lg:mr-5 mt-5">
                <h4 className="font-lora font-semibold text-gray-900">All users (100)</h4>
                <Box className="flex justify-center items-center gap-5">
                    <TextField
                        placeholder="Search"
                        variant="outlined"
                        className="w-[300px] font-lora"
                        InputLabelProps={{
                            className: 'font-lora text-gray-800',
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-500" />
                                </InputAdornment>
                            ),
                            className: 'font-lora text-gray-800',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#E5E7EB',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#6B7280',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3e98f2',
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '6px 6px',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                top: '-5px',
                            },
                        }}
                    />
                    <button className="flex justify-center items-center gap-1 font-lora text-white bg-black rounded-lg py-[6px] px-3 transition-all duration-200 ease-in-out active:scale-90">
                        <AddIcon />Add user
                    </button>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminUsers;