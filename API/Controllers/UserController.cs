using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UserController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet("allUser")]
        //[AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetAllUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            // /var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }
        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            userParams.CurrentUsername = user.UserName;
            
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }


            var users = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }



        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var users = await _userRepository.GetMemberByIdAsync(id);
            return Ok(users);
        }

        [Authorize(Roles = "Member")]

        [HttpGet("/api/user/username/{username}", Name = "GetUser")]
        //[AllowAnonymous]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var users = await _userRepository.GetMemberAsync(username);
            return users;

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                // return _mapper.Map<PhotoDto>(photo);
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");


        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain)
            {
                return BadRequest("this is already your main photo");
            }

            var curentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (curentMain != null)
            {
                curentMain.IsMain = false;
            }
            photo.IsMain = true;
            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("you cannot delete your main photo");
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);

            }
            user.Photos.Remove(photo);
            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");
        }
    }

}