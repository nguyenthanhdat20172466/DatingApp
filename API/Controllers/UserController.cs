using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.DTOs;
using AutoMapper;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController: BaseApiController
    {
        private readonly IUserRepository _userRepository;
         private readonly IMapper _mapper;
        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            // /var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var users = await _userRepository.GetMemberByIdAsync(id);
            return Ok(users);
        }
        [HttpGet("/api/user/username/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var users = await _userRepository.GetMemberAsync(username);
            return users;
            
        }
    }

}